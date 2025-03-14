/*globals $*/

import jQuery from 'jquery';
import 'jquery-ui';
import 'jquery.event.drag';
import 'jquery-nearest';
import 'circuit-solver';
import * as workbenchController from './controllers/workbench-controller.js';
import * as sound from './helpers/sound.js';

let scripts = document.getElementsByTagName('script'),
  path = scripts[scripts.length - 1].src.split('?')[0],      // remove any ?query
  packageRoot = path.split('/').slice(0, -2).join('/') + '/',

  soundFiles = { click: packageRoot + "common/sounds/click.ogg" };

function loadSounds() {
  let soundName, audio;

  for (soundName in soundFiles) {
    if (window.Audio) {
      audio = new Audio();
      audio.src = soundFiles[soundName];
      sound[soundName] = audio;
    }
  }
};

jQuery(() => {
  loadSounds();
});

function createWorkbench(props, elId) {
  workbenchController.createWorkbench(props, elId);
}

// this is probably too much access for an API, but doing it now for simplicity
// sparks.workbenchController = workbenchController;
// sparks.logController = workbenchController.logController;

// sparks.packageRoot = packageRoot;

export {
  createWorkbench,
  workbenchController,
  logController: workbenchController.logController,
  packageRoot
};
