import { faker } from '@faker-js/faker';

export const generateUserData = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: '0337809545',
    email: faker.internet.email(),
    password: 'Password@123',
  };
};

export const generatePackageData = () => {
  return {
    name: `Gói Tập ${faker.commerce.productName()}`,
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 100000, max: 10000000 }),
    durationMonths: faker.number.int({ min: 1, max: 24 }),
  };
};

export const generatePromotionData = () => {
  return {
    code: faker.string.alphanumeric(8).toUpperCase(),
    discountPercent: faker.number.int({ min: 5, max: 50 }),
    startDate: faker.date.soon().toISOString().split('T')[0],
    endDate: faker.date.future().toISOString().split('T')[0],
  };
};
