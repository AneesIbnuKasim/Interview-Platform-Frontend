export const GRADIENTS = {
  primary: 'bg-[radial-gradient(70%_90%_at_93%_90%,rgba(122,79,188,1)_3%,rgba(45,55,156,1)_100%)]',
  innerBox: 'bg-[radial-gradient(70%_90%_at_93%_90%,rgba(122,79,188,1)_3%,rgba(45,55,156,1)_100%)]',
  // 'bg-[linear-gradient(125deg,rgba(63,77,188,1)_67%,rgba(162,79,188,0.8)_100%)]'
  // dark: 'bg-[radial-gradient(circle,#24243e_30%,#302b63_60%,#0f0c29_100%)]'
  secondary: {
    light: 'bg-[radial-gradient(70%_90%_at_88%_90%,rgba(122,79,188,0.7)_23%,rgba(57,69,155,1)_84%)]',
    dark: 'bg-[radial-gradient(70%_90%_at_88%_90%,rgba(122,79,188,0.7)_23%,rgba(55,69,155,1)_84%)]'
  },
  success: 'bg-[linear-gradient(135deg,#a8edea_0%,#fed6e3_100%)]',
  warning: 'bg-[linear-gradient(135deg,#ff9f00_0%,#19547b_100%)]',
  danger: 'bg-[linear-gradient(135deg,#fc4a1a_0%,#f7b733_100%)]',
  info: 'bg-[linear-gradient(135deg,#74b9ff_0%,#0984e3_100%)]',
  dark: 'bg-[linear-gradient(135deg,#2d3436_0%,#636e72_100%)]'
};
export const CARD_STYLES = {
  base: 'rounded-[20px] border-0 shadow-lg'
};

export const LOGIN_CARD_STYLES = {
  base: 'rounded-[20px] border-0 shadow-lg',
  primary: 'bg-[radial-gradient(135deg,#7A4FBC_0%,#764ba2_100%)]'
};

export const BUTTON_VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  custom: 'bg-violet-600 text-white hover:bg-violet-800',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-500 text-white hover:bg-red-700',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
  info: 'bg-teal-600 text-white hover:bg-teal-700',
  light: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  dark: 'bg-gray-900 text-white hover:bg-gray-800',

  outline: {
    primary: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    custom: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
    secondary: 'border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
    success: 'border border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
    danger: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
    warning: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white',
    info: 'border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white',
    light: 'border border-gray-300 text-gray-700 hover:bg-gray-200',
    dark: 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
  }
};

export const ICON_SIZES = {
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
  xlarge: '3rem'
}

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
}

export const BUTTON_SIZE = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-4 text-xl',
}

export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
}

export const CURRENCY = '₹'
