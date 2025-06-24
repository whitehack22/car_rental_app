import person1 from '../../assets/images/person1.png';
import person2 from '../../assets/images/person2.png';
import person3 from '../../assets/images/person3.png';

type Testimonial = {
    id: number;
    name: string;
    role: string;
    image: string;
    content: string;
};

export const testimonialsData: Testimonial[] = [
    {
        id: 1,
        name: 'John Doe',
        role: 'Car Enthusiast',
        image: person1,
        content: 'Deluxe Car Rental has helped me to easily find cars for hire. They have a variety of cars at your own choosing',
    },
    {
        id: 2,
        name: 'Jane Smith',
        role: 'Software Engineer',
        image: person3,
        content: 'With Deluxe Car Rental I am able to find variety of cars at an affordable price.',
    },
    {
        id: 3,
        name: 'Michael Brown',
        role: 'Project Manager',
        image: person2,
        content: 'Deluxe Car Rental allows you to make reservations for a car so that you can be able to use it at a later date.',
    },
    {
        id: 4,
        name: 'Emily Davis',
        role: 'QA Analyst',
        image: person3,
        content: 'Deluxe Car Rental has good customer service who respond on a timely manner.',
    },
    {
        id: 5,
        name: 'David Wilson',
        role: 'DevOps Engineer',
        image: person1,
        content: 'The cars are well maintained. I rarely have an issue with the car that I hire',
    },
    {
        id: 6,
        name: 'Sophia Lee',
        role: 'Product Owner',
        image: person3,
        content: 'Deluxe Car Rental have a smooth payment system. It allows you to pay for a car for hire without issues. Highly recommend you check them out!',
    },
];