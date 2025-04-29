import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.CINEMACTRL_DB_HOST ?? 'localhost',
  port: parseInt(process.env.CINEMACTRL_DB_PORT ?? "5432", 10),
  username: process.env.CINEMACTRL_DB_USER ?? 'user',
  password: process.env.CINEMACTRL_DB_PASSWORD ?? 'password',
  database: process.env.CINEMACTRL_DB_DATABASE ?? 'appdb',
  synchronize: false,
});

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection initialized");
    
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    await queryRunner.startTransaction();
    
    try {
      const userCount = await queryRunner.query('SELECT COUNT(*) FROM "user"');
      if (parseInt(userCount[0].count) === 0) {
        const passwordHash = await bcryptjs.hash('password123', 10);
        const adminPasswordHash = await bcryptjs.hash('admin123', 10);
        
        const users = [
          { username: 'admin', password: adminPasswordHash, fullName: 'Admin User', role: UserRole.ADMIN },
          { username: 'user1', password: passwordHash, fullName: 'John Doe', role: UserRole.USER },
          { username: 'user2', password: passwordHash, fullName: 'Jane Smith', role: UserRole.USER },
          { username: 'user3', password: passwordHash, fullName: 'Michael Johnson', role: UserRole.USER },
          { username: 'user4', password: passwordHash, fullName: 'Emily Davis', role: UserRole.USER }
        ];
        
        for (const user of users) {
          await queryRunner.query(
            `INSERT INTO "user" (username, password, "fullName", role) 
             VALUES ($1, $2, $3, $4)`,
            [user.username, user.password, user.fullName, user.role]
          );
        }
        console.log(`${users.length} users seeded`);
      } else {
        console.log('Users already seeded');
      }
      
      const movieCount = await queryRunner.query('SELECT COUNT(*) FROM movie');
      if (parseInt(movieCount[0].count) === 0) {
        const movies = [
          {
            name: 'The Shawshank Redemption',
            ageRating: 16,
            description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
            duration: 142,
            releaseDate: '1994-09-23',
          },
          {
            name: 'The Godfather',
            ageRating: 18,
            description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
            duration: 175,
            releaseDate: '1972-03-24',
          },
          {
            name: 'The Dark Knight',
            ageRating: 12,
            description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
            duration: 152,
            releaseDate: '2008-07-18',
          },
          {
            name: 'Inception',
            ageRating: 12,
            description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
            duration: 148,
            releaseDate: '2010-07-16',
          },
          {
            name: 'Dune',
            ageRating: 12,
            description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
            imageUrl: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg',
            duration: 155,
            releaseDate: '2021-10-22',
          }
        ];
        
        for (const movie of movies) {
          await queryRunner.query(
            `INSERT INTO movie (name, "ageRating", description, "imageUrl", duration, "releaseDate") 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [movie.name, movie.ageRating, movie.description, movie.imageUrl, movie.duration, movie.releaseDate]
          );
        }
        console.log(`${movies.length} movies seeded`);
      } else {
        console.log('Movies already seeded');
      }
      
      const theaterCount = await queryRunner.query('SELECT COUNT(*) FROM theater');
      if (parseInt(theaterCount[0].count) === 0) {
        const theaters = [
          { name: 'Main Hall', capacity: 200 },
          { name: 'VIP Screen', capacity: 50 },
          { name: 'IMAX Theater', capacity: 300 },
          { name: 'Screen 4', capacity: 120 },
          { name: 'Screen 5', capacity: 120 }
        ];
        
        for (const theater of theaters) {
          await queryRunner.query(
            'INSERT INTO theater (name, capacity) VALUES ($1, $2)',
            [theater.name, theater.capacity]
          );
        }
        console.log(`${theaters.length} theaters seeded`);
      } else {
        console.log('Theaters already seeded');
      }
      
      // Seed showings
      const showingCount = await queryRunner.query('SELECT COUNT(*) FROM available_showing');
      if (parseInt(showingCount[0].count) === 0) {
        const movies = await queryRunner.query('SELECT id FROM movie');
        const theaters = await queryRunner.query('SELECT id, capacity FROM theater');
        const today = new Date();
        let showingsCount = 0;
        
        for (let day = 0; day < 7; day++) {
          const date = new Date(today);
          date.setDate(date.getDate() + day);
          
          for (const theater of theaters) {
            // Morning showing
            const morningTime = new Date(date);
            morningTime.setHours(10, 0, 0, 0);
            
            // Afternoon showing
            const afternoonTime = new Date(date);
            afternoonTime.setHours(15, 0, 0, 0);
            
            // Evening showing
            const eveningTime = new Date(date);
            eveningTime.setHours(20, 0, 0, 0);
            
            // Create showings with random movies
            const randomMovie1 = movies[Math.floor(Math.random() * movies.length)];
            const randomMovie2 = movies[Math.floor(Math.random() * movies.length)];
            const randomMovie3 = movies[Math.floor(Math.random() * movies.length)];
            
            await queryRunner.query(
              `INSERT INTO available_showing ("theaterId", "movieId", "startTime") 
               VALUES ($1, $2, $3)`,
              [theater.id, randomMovie1.id, morningTime]
            );
            
            await queryRunner.query(
              `INSERT INTO available_showing ("theaterId", "movieId", "startTime") 
               VALUES ($1, $2, $3)`,
              [theater.id, randomMovie2.id, afternoonTime]
            );
            
            await queryRunner.query(
              `INSERT INTO available_showing ("theaterId", "movieId", "startTime") 
               VALUES ($1, $2, $3)`,
              [theater.id, randomMovie3.id, eveningTime]
            );
            
            showingsCount += 3;
          }
        }
        console.log(`${showingsCount} showings seeded`);
      } else {
        console.log('Showings already seeded');
      }
      
      // Seed ratings
      const ratingCount = await queryRunner.query('SELECT COUNT(*) FROM rating');
      if (parseInt(ratingCount[0].count) === 0) {
        const users = await queryRunner.query('SELECT id FROM "user"');
        const movies = await queryRunner.query('SELECT id FROM movie');
        let ratingsCount = 0;
        
        for (const user of users) {
          const numRatings = Math.floor(Math.random() * 4) + 2;
          const selectedMovies = getRandomElements(movies, numRatings);
          
          for (const movie of selectedMovies) {
            const rating = Math.floor(Math.random() * 5) + 1;
            await queryRunner.query(
              'INSERT INTO rating ("userId", "movieId", rating) VALUES ($1, $2, $3)',
              [user.id, movie.id, rating]
            );
            ratingsCount++;
          }
        }
        
        console.log(`${ratingsCount} ratings seeded`);
      } else {
        console.log('Ratings already seeded');
      }
      
      // Seed reservations
      const reservationCount = await queryRunner.query('SELECT COUNT(*) FROM reservation');
      if (parseInt(reservationCount[0].count) === 0) {
        const users = await queryRunner.query('SELECT id FROM "user"');
        const showings = await queryRunner.query(
          `SELECT available_showing.id, theater.capacity 
           FROM available_showing 
           INNER JOIN theater ON available_showing."theaterId" = theater.id`
        );
        let reservationsCount = 0;
        
        for (const user of users) {
          const numReservations = Math.floor(Math.random() * 3) + 1;
          const selectedShowings = getRandomElements(showings, numReservations);
          
          for (const showing of selectedShowings) {
            const seat = Math.floor(Math.random() * showing.capacity) + 1;
            await queryRunner.query(
              'INSERT INTO reservation ("userId", "showingId", seat) VALUES ($1, $2, $3)',
              [user.id, showing.id, seat.toString()]
            );
            reservationsCount++;
          }
        }
        
        console.log(`${reservationsCount} reservations seeded`);
      } else {
        console.log('Reservations already seeded');
      }
      
      // Commit transaction
      await queryRunner.commitTransaction();
      console.log("Database seeding completed successfully!");
      
    } catch (error) {
      // Rollback transaction on error
      console.error("Error during seeding, rolling back:", error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
    
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("Database connection closed");
    }
  }
}

// Run the seed function
seed();
