export const resources = {
  en: {
    translation: {
      brand: 'Armenia Journeys',
      nav: { tours: 'Tours', destinations: 'Destinations', cars: 'Our Cars', transfer: 'Airport Transfer', driver: 'Private Driver' },
      actions: { book: 'Book Now', explore: 'Explore Tours', build: 'Build Your Trip', contact: 'Contact us' },
      home: {
        eyebrow: 'Private and group journeys across Armenia',
        title: 'Explore Armenia Your Way',
        subtitle: 'Private & group tours · Professional drivers · Comfortable cars',
        promise: 'Thoughtful routes and local knowledge, whether you choose a private car or a friendly small group.',
      },
      common: { loading: 'Loading…', error: 'Something went wrong.', retry: 'Try again', menu: 'Menu', language: 'Language' },
      auth: { signIn: 'Sign in', accessRequired: 'Please sign in to continue.' },
    },
  },
  ru: {
    translation: {
      brand: 'Путешествия по Армении',
      nav: { tours: 'Туры', destinations: 'Направления', cars: 'Наши автомобили', transfer: 'Трансфер из аэропорта', driver: 'Личный водитель' },
      actions: { book: 'Забронировать', explore: 'Смотреть туры', build: 'Создать маршрут', contact: 'Связаться' },
      home: {
        eyebrow: 'Частные и групповые путешествия по Армении',
        title: 'Откройте Армению по-своему',
        subtitle: 'Частные и групповые туры · Опытные водители · Комфортные автомобили',
        promise: 'Продуманные маршруты и местные знания — на частном автомобиле или в дружной небольшой группе.',
      },
      common: { loading: 'Загрузка…', error: 'Что-то пошло не так.', retry: 'Повторить', menu: 'Меню', language: 'Язык' },
      auth: { signIn: 'Войти', accessRequired: 'Войдите, чтобы продолжить.' },
    },
  },
  hy: {
    translation: {
      brand: 'Ճանապարհորդություններ Հայաստանում',
      nav: { tours: 'Տուրեր', destinations: 'Ուղղություններ', cars: 'Մեր մեքենաները', transfer: 'Օդանավակայանի տրանսֆեր', driver: 'Անձնական վարորդ' },
      actions: { book: 'Ամրագրել', explore: 'Դիտել տուրերը', build: 'Կազմել ուղևորություն', contact: 'Կապվել' },
      home: {
        eyebrow: 'Մասնավոր և խմբային ուղևորություններ Հայաստանում',
        title: 'Բացահայտեք Հայաստանը ձեր ձևով',
        subtitle: 'Մասնավոր և խմբային տուրեր · Փորձառու վարորդներ · Հարմարավետ մեքենաներ',
        promise: 'Մտածված երթուղիներ և տեղական փորձ՝ մասնավոր մեքենայով կամ ընկերական փոքր խմբով։',
      },
      common: { loading: 'Բեռնվում է…', error: 'Ինչ-որ բան սխալ է։', retry: 'Կրկին փորձել', menu: 'Մենյու', language: 'Լեզու' },
      auth: { signIn: 'Մուտք', accessRequired: 'Շարունակելու համար մուտք գործեք։' },
    },
  },
} as const

export type Locale = keyof typeof resources
export const supportedLocales = Object.keys(resources) as Locale[]
