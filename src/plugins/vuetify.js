import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const CustomLightTheme = {
  dark: false,
  colors: {
    background: '#ECEFF1',
    primary: '#3a3a3a',
    secondary: '#5CBBF6',
    manager: '#1f1f2e',
    social: '7E2553',
    ai_lab: '27445D',
    hyper3d: '#37474F',
    iconColor: '#000000',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'CustomLightTheme',
    icons: {
      iconfont: 'md' || 'fa' || 'md',
    },
    themes: {
      CustomLightTheme,
      dark: {
        colors: {
          primary: '#385155',
          secondary: '#5CBBF6',
          manager: '#535f7c',
          social: '1D2B53',
          ai_lab: '497D74',
          hyper3d: '#00C2A8',
          iconColor: '#FFFFFF',
        },
      },
    },
  },
})
