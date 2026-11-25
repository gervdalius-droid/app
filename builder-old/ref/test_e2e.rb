# End-to-end run of the real plugin code on the mock SketchUp API.
require_relative 'mock_sketchup'
load File.expand_path('../src/dedes_baldai.rb', __dir__)
require File.expand_path('../src/dedes_baldai/main.rb', __dir__)
include DedesBaldai
fail_ = lambda { |m| puts "FAIL: #{m}"; exit 1 }
m = $model

Dialog.show('new')
dlg = Dialog.instance_variable_get(:@dlg)
dlg.fire('ready')
fail_.call('init not sent') unless dlg.scripts.any? { |s| s.start_with?('DB.init(') }
fail_.call('state not sent') unless dlg.scripts.any? { |s| s.start_with?('DB.state(') }

payloads = JSON.parse(File.read('payloads.json'))
payloads.each { |p| dlg.fire('build', JSON.generate(p)) }
errs = dlg.scripts.select { |s| s.start_with?('DB.error') }
fail_.call(errs.join("\n")) unless errs.empty?
cabs = Collector.cabinets(m)
puts "built #{cabs.size} cabinets: " + cabs.map { |c| "#{c.name} (#{c.entities.grep(Sketchup::Group).size} groups)" }.join(', ')

# every panel group has 6 faces with outward normals, holes on the holes tag
bad = 0
cabs.each do |c|
  c.entities.grep(Sketchup::Group).each do |g|
    next if g.name == 'Kojelės'
    fs = g.entities.grep(Sketchup::Face)
    bad += 1 unless fs.size == 6
    bb = Geom::BoundingBox.new; fs.each { |f| bb.add(f.pts) }
    ctr = Geom.linear_combination(0.5, bb.min, 0.5, bb.max)
    fs.each { |f| fc = f.pts.inject([0, 0, 0]) { |a, p| [a[0] + p.x / 4, a[1] + p.y / 4, a[2] + p.z / 4] }
              bad += 1 if f.normal.dot(ctr.vector_to(Geom::Point3d.new(*fc))) <= 0 }
    hg = g.entities.grep(Sketchup::Group).first
    bad += 1 if hg && hg.layer.name != Builder::HOLES_TAG
  end
end
fail_.call("#{bad} bad panel solids") if bad > 0
# panel sizes match the engine: check cabinet 2 (TANDEM sample) side = 544 x 420 x 18
c2 = cabs.find { |c| c.get_attribute(DICT, 'nr') == 2 }
side = c2.entities.grep(Sketchup::Group).find { |g| g.get_attribute(DICT, 'role') == 'KAIRE' }
bb = Geom::BoundingBox.new; side.entities.grep(Sketchup::Face).each { |f| bb.add(f.pts) }
dims = [bb.width, bb.height, bb.depth].map { |v| v.to_mm.round(2) }.sort
fail_.call("side dims #{dims}") unless dims == [18.0, 420.0, 544.0]
holes = side.entities.grep(Sketchup::Group).first.entities.count
puts "TANDEM sample left side #{dims.reverse.join(' x ')} mm, #{holes} hole-circle edges, cabinet origin z=#{c2.transformation.origin.z.to_mm.round} mm (legs)"
legs = c2.entities.grep(Sketchup::Group).find { |g| g.name == 'Kojelės' }
fail_.call('legs missing') unless legs && legs.entities.grep(Sketchup::Face).size == 4 * 26

# update in place keeps the transformation and uid
before_tr = c2.transformation.to_a
upd = payloads[1].merge('uid' => c2.get_attribute(DICT, 'uid'))
upd['def'] = upd['def'].merge('name' => 'TANDEM2')
dlg.fire('build', JSON.generate(upd))
fail_.call('update created a new cabinet') unless Collector.cabinets(m).size == 6
fail_.call('update moved the cabinet') unless c2.transformation.to_a == before_tr && c2.name == 'S2 TANDEM2'

# user copies cabinet 3 (same definition, same attributes)
c3 = cabs.find { |c| c.get_attribute(DICT, 'nr') == 3 }
cp = Sketchup::Group.new(c3.definition); cp.attrs = c3.attrs_copy; cp.name = c3.name
cp.transformation = Geom::Transformation.new(Geom::Point3d.new(100, 0, 0)); m.entities.items << cp
# user scales cabinet 6 (dishwasher)
c6 = cabs.find { |c| c.get_attribute(DICT, 'nr') == 6 }
c6.transformation = c6.transformation * Geom::Transformation.scaling(1.1, 1, 1)

# hand-drawn panels
box = lambda do |ents, l, w, t|
  p = [[0,0,0],[l,0,0],[l,w,0],[0,w,0],[0,0,t],[l,0,t],[l,w,t],[0,w,t]].map { |a| Geom::Point3d.new(*a.map(&:mm)) }
  [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]].each { |q| ents.add_face(q.map { |i| p[i] }) }
end
top = m.entities.add_group; top.name = 'Stalviršis'; box.call(top.entities, 2400, 600, 38)
shelf_def = Sketchup::ComponentDefinition.new('Lentyna sienai'); box.call(shelf_def.entities, 800, 250, 18)
s1 = m.entities.add_instance(shelf_def, Geom::Transformation.new(Geom::Point3d.new(0, 0, 50)))
s2 = m.entities.add_instance(shelf_def, Geom::Transformation.new(Geom::Point3d.new(0, 0, 60)))
s1.set_attribute(DICT, 'eb', JSON.generate('eb1' => 'ABS 0.8 Balta'))   # only one instance banded → two separate rows
pg = m.entities.add_group; pg.name = 'Paaukštinimas'; m.materials.add('LMDP 18 Pilka')
plinth = pg.entities.add_group; box.call(plinth.entities, 18, 2400, 100); plinth.material = m.materials['LMDP 18 Pilka']
handle = m.entities.add_group; handle.name = 'Rankenėlė'; box.call(handle.entities, 160, 30, 10)
hidden = m.entities.add_group; hidden.name = 'Paslėpta'; box.call(hidden.entities, 600, 600, 18); hidden.hidden = true
skip = m.entities.add_group; skip.name = 'Šablonas'; box.call(skip.entities, 600, 600, 18)

# panel properties on the skip one, through the dialog callback
m.selection.clear; m.selection.add(skip)
dlg.fire('set_panel', JSON.generate('skip' => true))
m.selection.clear

dlg.scripts.clear
dlg.fire('collect')
s = dlg.scripts.find { |x| x.start_with?('DB.collected(') } or fail_.call('no collected')
col = JSON.parse(s.sub(/\ADB\.collected\(/, '').sub(/\)\z/, ''))
File.write('collected.json', JSON.generate(col))
nrs = col['cabinets'].map { |c| c['nr'] }.sort
puts "collected: cabinets #{nrs.inspect}, loose #{col['loose'].map { |l| "#{l['name']} #{l['L']}x#{l['W']}x#{l['T']} #{l['mat']}" }.inspect}"
fail_.call('copy not renumbered') unless nrs == [1, 2, 3, 4, 5, 6, 7]
fail_.call('copy kept uid') unless col['cabinets'].map { |c| c['uid'] }.uniq.size == 7
fail_.call('scale not detected') unless col['cabinets'].find { |c| c['nr'] == 6 }['scaled']
names = col['loose'].map { |l| l['name'] }
fail_.call('loose detection wrong: ' + names.inspect) unless names.sort == ['', 'Lentyna sienai', 'Lentyna sienai', 'Stalviršis'].sort
fail_.call('undo stack: ' + m.ops.inspect) unless m.ops.include?('Spintelių numeracija')
puts "operations: #{m.ops.uniq.inspect}"
