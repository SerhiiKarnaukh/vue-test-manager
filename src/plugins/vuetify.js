import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const CustomLightTheme = {
    dark: false,
    colors: {
      background: '#ECEFF1',
      primary: '#1867C0',
      secondary: '#5CBBF6',
    }
  }


export default createVuetify({
 theme: {
    defaultTheme: 'CustomLightTheme',
    icons: {
      iconfont: 'md' || 'fa' || 'md'

    },
    themes: {
      CustomLightTheme,
      dark: {
        colors: {
          primary: '#385155',
          secondary: '#5CBBF6',
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 340,
      md: 540,
      lg: 800,
      xl: 1280,
    },
  },
})
