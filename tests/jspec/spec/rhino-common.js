load('spec/support/env.rhino.js');

load('../../client-mr-activity.js');
load('../../client-breadboard-activity.js');
load('activities/series-interpretive.js');

load('spec/lib/jspec.js');
load('spec/lib/jspec.timers.js');
load('spec/lib/jspec.jquery.js');
load('spec/lib/jspec.xhr.js');
load('spec/lib/jspec.shell.js');
load('spec/support/junit.xml.js');

load('lib/common.js');



specResults = JSpec
// .exec('spec/spec.common/spec.logging_and_reporting.js')
// .exec('spec/spec.common/spec.string.js')
// .exec('spec/spec.common/spec.util.js')
// .exec('spec/spec.common/spec.units.js')

// .exec('spec/spec.circuit/spec.resistor_colors.js')
// .exec('spec/spec.circuit/spec.breadboard.js')
// .exec('spec/spec.circuit/spec.breadboard_measuring.js')
// .exec('spec/spec.circuit/spec.flash_multimeter.js') <=== working?
// .exec('spec/spec.circuit/spec.flash_breadboard.js') <=== working?
// .exec('spec/spec.circuit/spec.circuit_constructor.js')

.exec('spec/spec.activities/spec.pages.js')
.exec('spec/spec.activities/spec.questions.js')
.exec('spec/spec.activities/spec.activity_creator.js')
.exec('spec/spec.activities/spec.page_reports.js');
// .exec('spec/spec.activities/spec.activity_interactions.js');

