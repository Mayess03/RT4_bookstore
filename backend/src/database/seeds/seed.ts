import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Book,
  Category,
  Cart,
} from '../entities';
import { Role } from '../../common/enums';

export async function seed(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const bookRepository = dataSource.getRepository(Book);
  const cartRepository = dataSource.getRepository(Cart);

  console.log('🌱 Starting database seeding...');

  // Check if data already exists
  const existingUsers = await userRepository.count();
  // if (existingUsers > 0) {
  //   console.log('⚠️  Database already seeded. Skipping...');
  //   return;
  // }

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create Users
  console.log('👤 Creating users...');
  // const admin = userRepository.create({
  //   email: 'admin@bookstore.com',
  //   password: hashedPassword,
  //   firstName: 'Admin',
  //   lastName: 'User',
  //   role: Role.ADMIN,
  //   isActive: true,
  // });

  const user1 = userRepository.create({
    email: 'john.doe@example.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
    role: Role.USER,
    isActive: true,
  });

  const user2 = userRepository.create({
    email: 'jane.smith@example.com',
    password: hashedPassword,
    firstName: 'Jane',
    lastName: 'Smith',
    role: Role.USER,
    isActive: true,
  });

  await userRepository.save([ user1, user2]);
  console.log('✅ Users created');

  // Create Carts for users
  console.log('🛒 Creating carts...');
  const cart1 = cartRepository.create({ userId: user1.id });
  const cart2 = cartRepository.create({ userId: user2.id });
  await cartRepository.save([cart1, cart2]);
  console.log('✅ Carts created');

  // Create Categories
  console.log('📚 Creating categories...');
  const categories = await categoryRepository.save([
    {
      name: 'Fiction',
      description: 'Fictional works including novels and short stories',
    },
    {
      name: 'Science-Fiction',
      description: 'Science fiction and futuristic novels',
    },
    {
      name: 'Fantasy',
      description: 'Fantasy and magical realism',
    },
    {
      name: 'Business',
      description: 'Business, economics, and entrepreneurship',
    },
    {
      name: 'Technology',
      description: 'Technology, programming, and computer science',
    },
    {
      name: 'Self-Help',
      description: 'Personal development and self-improvement',
    },
    {
      name: 'History',
      description: 'Historical events and biographies',
    },
    {
      name: 'Science',
      description: 'Scientific research and discoveries',
    },
  ]);
  console.log('✅ Categories created');

  // Create Books
  console.log('📖 Creating books...');
  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      price: 12.99,
      stock: 50,
      description:
        'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
      categoryId: categories.find((c) => c.name === 'Fiction')?.id,
      isActive: true,
    },
    {
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0-441-17271-9',
      price: 18.99,
      stock: 35,
      description:
        'An epic science fiction novel about politics, religion, and ecology on the desert planet Arrakis.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
      categoryId: categories.find((c) => c.name === 'Science-Fiction')?.id,
      isActive: true,
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-547-92822-7',
      price: 14.99,
      stock: 60,
      description:
        'A fantasy adventure following Bilbo Baggins on his quest with dwarves to reclaim their treasure.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
      categoryId: categories.find((c) => c.name === 'Fantasy')?.id,
      isActive: true,
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      isbn: '978-0-307-88791-7',
      price: 16.99,
      stock: 40,
      description:
        'A methodology for developing businesses and products through validated learning and experimentation.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780307887917-L.jpg',
      categoryId: categories.find((c) => c.name === 'Business')?.id,
      isActive: true,
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-132-35088-4',
      price: 42.99,
      stock: 25,
      description:
        'A handbook of agile software craftsmanship with practical advice on writing clean, maintainable code.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
      categoryId: categories.find((c) => c.name === 'Technology')?.id,
      isActive: true,
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0-735-21129-2',
      price: 15.99,
      stock: 70,
      description:
        'An easy and proven way to build good habits and break bad ones through small changes.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
      categoryId: categories.find((c) => c.name === 'Self-Help')?.id,
      isActive: true,
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      price: 13.99,
      stock: 55,
      description:
        'A dystopian social science fiction novel about totalitarianism and surveillance.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg',
      categoryId: categories.find((c) => c.name === 'Fiction')?.id,
      isActive: true,
    },
    {
      title: "The Hitchhiker's Guide to the Galaxy",
      author: 'Douglas Adams',
      isbn: '978-0-345-39180-3',
      price: 11.99,
      stock: 45,
      description:
        'A comedic science fiction series following Arthur Dent through space after Earth is demolished.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg',
      categoryId: categories.find((c) => c.name === 'Science-Fiction')?.id,
      isActive: true,
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      isbn: '978-0-062-31609-8',
      price: 19.99,
      stock: 30,
      description:
        'A brief history of humankind, exploring how Homo sapiens came to dominate the world.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
      categoryId: categories.find((c) => c.name === 'History')?.id,
      isActive: true,
    },
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '978-0-553-38016-3',
      price: 17.99,
      stock: 20,
      description:
        'An exploration of cosmology, black holes, and the nature of time and the universe.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg',
      categoryId: categories.find((c) => c.name === 'Science')?.id,
      isActive: true,
    },
    {
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      isbn: '978-0-439-70818-8',
      price: 14.99,
      stock: 80,
      description:
        'The first book in the Harry Potter series, following a young wizard discovering his magical heritage.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
      categoryId: categories.find((c) => c.name === 'Fantasy')?.id,
      isActive: true,
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas, Andrew Hunt',
      isbn: '978-0-135-95705-9',
      price: 39.99,
      stock: 18,
      description:
        'A guide to becoming a better programmer with practical advice and best practices.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
      categoryId: categories.find((c) => c.name === 'Technology')?.id,
      isActive: true,
    },
    {
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      isbn: '978-1-585-42433-9',
      price: 12.99,
      stock: 50,
      description:
        'A classic personal development book on achieving success through positive thinking.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg',
      categoryId: categories.find((c) => c.name === 'Self-Help')?.id,
      isActive: true,
    },
    {
      title: 'Zero to One',
      author: 'Peter Thiel',
      isbn: '978-0-804-13929-8',
      price: 16.99,
      stock: 35,
      description:
        'Notes on startups and how to build the future by creating truly innovative companies.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
      categoryId: categories.find((c) => c.name === 'Business')?.id,
      isActive: true,
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-618-64561-1',
      price: 29.99,
      stock: 40,
      description:
        'An epic high-fantasy trilogy following the quest to destroy the One Ring.',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg',
      categoryId: categories.find((c) => c.name === 'Fantasy')?.id,
      isActive: true,
    },
  ];

  await bookRepository.save(books);
  console.log('✅ Books created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - ${await userRepository.count()} users created`);
  console.log(`   - ${await categoryRepository.count()} categories created`);
  console.log(`   - ${await bookRepository.count()} books created`);
  console.log(`   - ${await cartRepository.count()} carts created`);
  console.log('\n🔐 Login credentials:');
  console.log('   Admin: admin@bookstore.com / Password123!');
  console.log('   User1: john.doe@example.com / Password123!');
  console.log('   User2: jane.smith@example.com / Password123!');
}
