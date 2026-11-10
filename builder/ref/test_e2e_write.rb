require_relative 'mock_sketchup'
load File.expand_path('../src/dedes_baldai.rb', __dir__)
require File.expand_path('../src/dedes_baldai/main.rb', __dir__)
DedesBaldai::Dialog.show
dlg = DedesBaldai::Dialog.instance_variable_get(:@dlg)
$select_dir = File.expand_path('out', __dir__)
dlg.fire('write_all', File.read('write_all.json'))
puts dlg.scripts.grep(/DB\.(saved|error)/).map { |s| s[0, 220] }
