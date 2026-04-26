/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '70%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        felixLetter: {
          '0%':   { transform: 'translateY(-80px) scale(0) rotate(-20deg)', opacity: '0' },
          '70%':  { transform: 'translateY(5px) scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: '1' },
        },
        catBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        confettiFall: {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0' },
        },
        spin3D: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '80%':  { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'bounce-in':    'bounceIn 0.35s ease-out both',
        'felix-letter': 'felixLetter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'cat-bounce':   'catBounce 1s ease-in-out infinite',
        'confetti-fall':'confettiFall 3s linear infinite',
        'spin3D':       'spin3D 8s linear infinite',
        'pop-in':       'popIn 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
