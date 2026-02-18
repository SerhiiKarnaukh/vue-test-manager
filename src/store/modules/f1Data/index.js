import sessions from './sessions'
import telemetry from './telemetry'
import strategy from './strategy'
import weather from './weather'
import raceControl from './raceControl'
import security from './security'
import websocket from './websocket'

export default {
  namespaced: true,
  modules: {
    sessions,
    telemetry,
    strategy,
    weather,
    raceControl,
    security,
    websocket
  }
}
