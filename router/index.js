import clientAccessControl from '../utilities/client-access-control.js';
import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

import clearQueue from '../handlers/clear-queue.handler.js';
import desktopInit from '../handlers/desktop-init.handler.js';
import disconnect from '../handlers/disconnect.handler.js';
import newClientConnected from '../handlers/new-client-connected.handler.js';
import playNext from '../handlers/play-next.handler.js';
import playPause from '../handlers/play-pause.handler.js';
import playPrevious from '../handlers/play-previous.handler.js';
import stopPlayback from '../handlers/stop-playback.handler.js';
import updateCurrentTrack from '../handlers/update-current-track.handler.js';
import updateLoop from '../handlers/update-loop.handler.js';
import updateMute from '../handlers/update-mute.handler.js';
import updatePlaybackState from '../handlers/update-playback-state.handler.js';
import updateProgress from '../handlers/update-progress.handler.js';
import updateQueue from '../handlers/update-queue.handler.js';
import updateShuffle from '../handlers/update-shuffle.handler.js';
import updateVolume from '../handlers/update-volume.handler.js';

/**
 * Router for the incoming events
 * @param {*} socket - socket object
 * @param {*} io - Socket.IO object
 * @returns {Promise<void>}
 */
export default async (socket, io) => {
  try {
    log(` > connected: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);

    // client access control
    await clientAccessControl(socket, io);

    // join the room
    socket.join(socket.user.id);
    await newClientConnected(socket);

    // event handlers
    socket.on(SOCKET_EVENTS.CLEAR_QUEUE, () => clearQueue(socket));
    socket.on(SOCKET_EVENTS.DESKTOP_INIT, (data) => desktopInit(socket, data));
    socket.on(SOCKET_EVENTS.PLAY_NEXT, () => playNext(socket));
    socket.on(SOCKET_EVENTS.PLAY_PAUSE, () => playPause(socket));
    socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, () => playPrevious(socket));
    socket.on(SOCKET_EVENTS.STOP_PLAYBACK, () => stopPlayback(socket));
    socket.on(SOCKET_EVENTS.UPDATE_CURRENT_TRACK, (data) => updateCurrentTrack(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_LOOP, (data) => updateLoop(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_MUTE, (data) => updateMute(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_PLAYBACK_STATE, (data) => updatePlaybackState(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_PROGRESS, (data) => updateProgress(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_QUEUE, (data) => updateQueue(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_SHUFFLE, (data) => updateShuffle(socket, data));
    socket.on(SOCKET_EVENTS.UPDATE_VOLUME, (data) => updateVolume(socket, data));

    // handle client disconnect
    socket.on(
      SOCKET_EVENTS.DISCONNECT,
      (reason = '') => disconnect(socket, reason),
    );
  } catch (error) {
    log(error);
  }
};
