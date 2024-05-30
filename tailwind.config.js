module.exports = {
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards',
          'fade-out': 'fadeOut 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards',
          'text-color-change': 'textColorChange 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          fadeOut: {
            '0%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
          textColorChange: {
            '0%': {
              borderColor: '#3bff80',
              color: '#d1d5db',
              backgroundColor: 'transparent',
            },
            '20%': {
              borderColor: '#3bff80',
              color: '#3bff80',
            //   backgroundColor: 'rgba(59, 255, 128, 0.1)',
            },
            '50%': {
              borderColor: '#3bff80',
              color: '#3bff80',
              backgroundColor: 'rgba(59, 255, 128, 0.3)',
            },
            '80%': {
              borderColor: '#3bff80',
              color: '#3bff80',
            //   backgroundColor: 'rgba(59, 255, 128, 0.1)',
            },
            '100%': {
              borderColor: '#3bff80',
              color: '#d1d5db',
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    plugins: [],
  };
  