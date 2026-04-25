/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        comic: ['Bangers', 'cursive'],
        body: ['"Comic Neue"', 'cursive'],
      },
      colors: {
        'neon-pink': '#FF2D78',
        'neon-blue': '#00D4FF',
        'neon-green': '#00FF88',
        'neon-yellow': '#FFE000',
        dark: '#09090F',
        'dark-card': '#13131F',
        'dark-border': '#2A2A40',
        'dark-hover': '#1E1E30',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        felixLetter: {
          '0%': { transform: 'translateY(-80px) scale(0) rotate(-20deg)', opacity: '0' },
          '70%': { transform: 'translateY(5px) scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)', opacity: '1' },
        },
        catBounce: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-5deg)' },
          '50%': { transform: 'translateY(-25px) rotate(5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 224, 0, 0.4), 0 0 30px rgba(255, 45, 120, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 224, 0, 0.9), 0 0 80px rgba(255, 45, 120, 0.6)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-8px, -4px)' },
          '20%': { transform: 'translate(8px, 4px)' },
          '30%': { transform: 'translate(-6px, 2px)' },
          '40%': { transform: 'translate(6px, -2px)' },
          '50%': { transform: 'translate(-4px, 4px)' },
          '60%': { transform: 'translate(4px, -4px)' },
          '70%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '90%': { transform: 'translate(-1px, 1px)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        spin3D: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '80%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'felix-letter': 'felixLetter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
        'cat-bounce': 'catBounce 1s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'confetti-fall': 'confettiFall 3s linear infinite',
        'screen-shake': 'screenShake 0.5s ease-in-out',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        spin3D: 'spin3D 8s linear infinite',
        'pop-in': 'popIn 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
    },
  },
  plugins: [],
};
