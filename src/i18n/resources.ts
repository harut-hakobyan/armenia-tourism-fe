export const resources = {
  en: {
    translation: {
      brand: 'Armenia Journeys',
      nav: { tours: 'Group Tours', destinations: 'Destinations', cars: 'Our Cars', transfer: 'Airport Transfer', driver: 'Private Driver' },
      actions: { book: 'Book Now', explore: 'Explore Tours', exploreGroup: 'Explore Group Tours', viewPrivate: 'View private tours', build: 'Build Your Trip', contact: 'Contact us' },
      home: {
        eyebrow: 'Small-group adventures across Armenia',
        title: 'Discover Armenia Together',
        subtitle: 'Scheduled group tours · Local expertise · Comfortable transport',
        privateAvailable: 'Looking for a tour just for your party?',
        promise: 'Choose every stop, departure time, and car for a fully private Armenia journey at your own pace.',
      },
      common: { loading: 'Loading…', error: 'Something went wrong.', retry: 'Try again', menu: 'Menu', language: 'Language' },
      auth: { signIn: 'Sign in', accessRequired: 'Please sign in to continue.' },
    },
  },
  ru: {
    translation: {
      brand: 'Путешествия по Армении',
      nav: { tours: 'Групповые туры', destinations: 'Направления', cars: 'Наши автомобили', transfer: 'Трансфер из аэропорта', driver: 'Личный водитель' },
      actions: { book: 'Забронировать', explore: 'Смотреть туры', exploreGroup: 'Групповые туры', viewPrivate: 'Смотреть частные туры', build: 'Создать маршрут', contact: 'Связаться' },
      home: {
        eyebrow: 'Групповые путешествия по Армении',
        title: 'Откройте Армению вместе',
        subtitle: 'Групповые туры по расписанию · Местные эксперты · Комфортный транспорт',
        privateAvailable: 'Предпочитаете тур только для своей компании?',
        promise: 'Выберите каждую остановку, время отправления и автомобиль для полностью частного путешествия по Армении в своём темпе.',
      },
      common: { loading: 'Загрузка…', error: 'Что-то пошло не так.', retry: 'Повторить', menu: 'Меню', language: 'Язык' },
      auth: { signIn: 'Войти', accessRequired: 'Войдите, чтобы продолжить.' },
    },
  },
  hy: {
    translation: {
      brand: 'Ճանապարհորդություններ Հայաստանում',
      nav: { tours: 'Խմբային տուրեր', destinations: 'Ուղղություններ', cars: 'Մեր մեքենաները', transfer: 'Օդանավակայանի տրանսֆեր', driver: 'Անձնական վարորդ' },
      actions: { book: 'Ամրագրել', explore: 'Դիտել տուրերը', exploreGroup: 'Դիտել խմբային տուրերը', viewPrivate: 'Դիտել մասնավոր տուրերը', build: 'Կազմել ուղևորություն', contact: 'Կապվել' },
      home: {
        eyebrow: 'Խմբային արկածներ Հայաստանում',
        title: 'Բացահայտեք Հայաստանը միասին',
        subtitle: 'Խմբային տուրեր ըստ ժամանակացույցի · Տեղացի մասնագետներ · Հարմարավետ տրանսպորտ',
        privateAvailable: 'Նախընտրո՞ւմ եք տուր միայն ձեր խմբի համար։',
        promise: 'Ընտրեք յուրաքանչյուր կանգառը, մեկնման ժամը և մեքենան՝ Հայաստանում լիովին մասնավոր ուղևորության համար։',
      },
      common: { loading: 'Բեռնվում է…', error: 'Ինչ-որ բան սխալ է։', retry: 'Կրկին փորձել', menu: 'Մենյու', language: 'Լեզու' },
      auth: { signIn: 'Մուտք', accessRequired: 'Շարունակելու համար մուտք գործեք։' },
    },
  },
} as const

export type Locale = keyof typeof resources
export const supportedLocales = Object.keys(resources) as Locale[]
