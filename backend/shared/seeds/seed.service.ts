import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Movie } from '../entities/movie.entity';
import { Theater } from '../entities/theater.entity';
import { AvailableShowing } from '../entities/available-showing.entity';
import { Rating } from '../entities/rating.entity';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private theaterRepository: Repository<Theater>,
    @InjectRepository(AvailableShowing)
    private showingRepository: Repository<AvailableShowing>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async seed() {
    await this.seedUsers();
    await this.seedMovies();
    await this.seedTheaters();
    await this.seedShowings();
    await this.seedRatings();
    await this.seedReservations();
    
    console.log('Database seeded successfully!');
  }

  async seedUsers() {
    const count = await this.userRepository.count();
    if (count > 0) {
      console.log('Users already seeded');
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);
    const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);

    const users = [
      {
        username: 'admin',
        password: adminPasswordHash,
        fullName: 'Admin User',
        role: UserRole.ADMIN,
      },
      {
        username: 'user1',
        password: passwordHash,
        fullName: 'John Doe',
        role: UserRole.USER,
      },
      {
        username: 'user2',
        password: passwordHash,
        fullName: 'Jane Smith',
        role: UserRole.USER,
      },
      {
        username: 'user3',
        password: passwordHash,
        fullName: 'Michael Johnson',
        role: UserRole.USER,
      },
      {
        username: 'user4',
        password: passwordHash,
        fullName: 'Emily Davis',
        role: UserRole.USER,
      },
    ];

    await this.userRepository.save(users);
    console.log(`${users.length} users seeded`);
  }

  async seedMovies() {
    const count = await this.movieRepository.count();
    if (count > 0) {
      console.log('Movies already seeded');
      return;
    }

    const movies = [
      {
        name: 'The Shawshank Redemption',
        ageRating: 16,
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
        duration: 142,
        releaseDate: new Date('1994-09-23'),
      },
      {
        name: 'The Godfather',
        ageRating: 18,
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        duration: 175,
        releaseDate: new Date('1972-03-24'),
      },
      {
        name: 'The Dark Knight',
        ageRating: 12,
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
      },
      {
        name: 'Pulp Fiction',
        ageRating: 18,
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        duration: 154,
        releaseDate: new Date('1994-10-14'),
      },
      {
        name: 'Inception',
        ageRating: 12,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
      },
      {
        name: 'Dune',
        ageRating: 12,
        description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg',
        duration: 155,
        releaseDate: new Date('2021-10-22'),
      },
      {
        name: 'Oppenheimer',
        ageRating: 15,
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
      },
    ];

    await this.movieRepository.save(movies);
    console.log(`${movies.length} movies seeded`);
  }

  async seedTheaters() {
    const count = await this.theaterRepository.count();
    if (count > 0) {
      console.log('Theaters already seeded');
      return;
    }

    const theaters = [
      { name: 'Main Hall', capacity: 200 },
      { name: 'VIP Screen', capacity: 50 },
      { name: 'IMAX Theater', capacity: 300 },
      { name: 'Screen 4', capacity: 120 },
      { name: 'Screen 5', capacity: 120 },
    ];

    await this.theaterRepository.save(theaters);
    console.log(`${theaters.length} theaters seeded`);
  }

  async seedShowings() {
    const count = await this.showingRepository.count();
    if (count > 0) {
      console.log('Showings already seeded');
      return;
    }

    const movies = await this.movieRepository.find();
    const theaters = await this.theaterRepository.find();

    const showings: Partial<AvailableShowing>[] = [];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      for (const theater of theaters) {
        const morningDate = new Date(date);
        morningDate.setHours(10, 0, 0, 0);
        showings.push({
          theater: theater,
          movie: movies[Math.floor(Math.random() * movies.length)],
          startTime: morningDate,
        });

        const afternoonDate = new Date(date);
        afternoonDate.setHours(15, 0, 0, 0);
        showings.push({
          theater: theater,
          movie: movies[Math.floor(Math.random() * movies.length)],
          startTime: afternoonDate,
        });

        const eveningDate = new Date(date);
        eveningDate.setHours(20, 0, 0, 0);
        showings.push({
          theater: theater,
          movie: movies[Math.floor(Math.random() * movies.length)],
          startTime: eveningDate,
        });
      }
    }

    await this.showingRepository.save(showings);
    console.log(`${showings.length} showings seeded`);
  }

  async seedRatings() {
    const count = await this.ratingRepository.count();
    if (count > 0) {
      console.log('Ratings already seeded');
      return;
    }

    const users = await this.userRepository.find();
    const movies = await this.movieRepository.find();
    const ratings: Partial<Rating>[] = [];

    for (const user of users) {
      const numRatings = Math.floor(Math.random() * 4) + 2;
      const selectedMovies = this.getRandomElements(movies, numRatings);
      
      for (const movie of selectedMovies) {
        ratings.push({
          user: user,
          movie: movie,
          rating: Math.floor(Math.random() * 5) + 1,
        });
      }
    }

    await this.ratingRepository.save(ratings);
    console.log(`${ratings.length} ratings seeded`);
  }

  async seedReservations() {
    const count = await this.reservationRepository.count();
    if (count > 0) {
      console.log('Reservations already seeded');
      return;
    }

    const users = await this.userRepository.find();
    const showings = await this.showingRepository.find({ relations: ['theater'] });
    const reservations: Partial<Reservation>[] = [];

    for (const user of users) {
      const numReservations = Math.floor(Math.random() * 3) + 1;
      const selectedShowings = this.getRandomElements(showings, numReservations);

      for (const showing of selectedShowings) {
        const seat = Math.floor(Math.random() * showing.theater.capacity) + 1;
        reservations.push({
          user: user,
          showing: showing,
          seat: seat.toString(),
        });
      }
    }

    await this.reservationRepository.save(reservations);
    console.log(`${reservations.length} reservations seeded`);
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}