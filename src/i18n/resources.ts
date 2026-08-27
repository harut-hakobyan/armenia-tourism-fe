export const resources = {
  en: {
    translation: {
      brand: 'Armenia Private Journeys',
      nav: { tours: 'Tours', destinations: 'Destinations', cars: 'Our Cars', transfer: 'Airport Transfer', driver: 'Private Driver' },
      actions: { book: 'Book Now', explore: 'Explore Tours', build: 'Build Your Trip', contact: 'Contact us' },
      home: {
        eyebrow: 'Private journeys across Armenia',
        title: 'Explore Armenia Your Way',
        subtitle: 'Private tours · Professional drivers · Comfortable cars',
        promise: 'Thoughtful routes, local knowledge, and one comfortable car reserved just for you.',
      },
      common: { loading: 'Loading…', error: 'Something went wrong.', retry: 'Try again', menu: 'Menu', language: 'Language' },
      auth: { signIn: 'Sign in', accessRequired: 'Please sign in to continue.' },
    },
  },
  ru: {
    translation: {
      brand: 'Частные путешествия по Армении',
      nav: { tours: 'Туры', destinations: 'Направления', cars: 'Наши автомобили', transfer: 'Трансфер из аэропорта', driver: 'Личный водитель' },
      actions: { book: 'Забронировать', explore: 'Смотреть туры', build: 'Создать маршрут', contact: 'Связаться' },
      home: {
        eyebrow: 'Частные путешествия по Армении',
        title: 'Откройте Армению по-своему',
        subtitle: 'Частные туры · Опытные водители · Комфортные автомобили',
        promise: 'Продуманные маршруты, местные знания и комфортный автомобиль только для вас.',
      },
      common: { loading: 'Загрузка…', error: 'Что-то пошло не так.', retry: 'Повторить', menu: 'Меню', language: 'Язык' },
      auth: { signIn: 'Войти', accessRequired: 'Войдите, чтобы продолжить.' },
    },
  },
  hy: {
    translation: {
      brand: 'Մասնավոր ճանապարհորդություններ Հայաստանում',
      nav: { tours: 'Տուրեր', destinations: 'Ուղղություններ', cars: 'Մեր մեքենաները', transfer: 'Օդանավակայանի տրանսֆեր', driver: 'Անձնական վարորդ' },
      actions: { book: 'Ամրագրել', explore: 'Դիտել տուրերը', build: 'Կազմել ուղևորություն', contact: 'Կապվել' },
      home: {
        eyebrow: 'Մասնավոր ուղևորություններ Հայաստանում',
        title: 'Բացահայտեք Հայաստանը ձեր ձևով',
        subtitle: 'Մասնավոր տուրեր · Փորձառու վարորդներ · Հարմարավետ մեքենաներ',
        promise: 'Մտածված երթուղիներ, տեղական փորձ և միայն ձեզ համար նախատեսված հարմարավետ մեքենա։',
      },
      common: { loading: 'Բեռնվում է…', error: 'Ինչ-որ բան սխալ է։', retry: 'Կրկին փորձել', menu: 'Մենյու', language: 'Լեզու' },
      auth: { signIn: 'Մուտք', accessRequired: 'Շարունակելու համար մուտք գործեք։' },
    },
  },
} as const

export type Locale = keyof typeof resources
export const supportedLocales = Object.keys(resources) as Locale[]
