import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { HomepageContent } from '../homepage/entities/homepage-content.entity';
import { Bar } from '../bars/entities/bar.entity';
import { Distillery } from '../distilleries/entities/distillery.entity';
import { Event } from '../events/entities/event.entity';
import { Blog } from '../blogs/entities/blog.entity';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Starting database seeding...');

  const userRepository = dataSource.getRepository(User);
  const homepageRepository = dataSource.getRepository(HomepageContent);
  const barRepository = dataSource.getRepository(Bar);
  const distilleryRepository = dataSource.getRepository(Distillery);
  const eventRepository = dataSource.getRepository(Event);
  const blogRepository = dataSource.getRepository(Blog);

  // Create default admin user
  const existingAdmin = await userRepository.findOne({ where: { email: 'admin@byfoods.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      email: 'admin@byfoods.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
    });
    await userRepository.save(adminUser);
    console.log('✅ Default admin user created: admin@byfoods.com / admin123');
  }

  // Initialize default homepage content
  const defaultSections = [
    {
      section: 'banner',
      content: {
        title: 'Premium',
        subtitle: 'Nightlife',
        description: 'Discover the finest bars, distilleries, and exclusive events in the city',
        backgroundImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=1080&fit=crop',
        primaryButton: {
          text: 'Explore Now',
          link: '/bars'
        },
        secondaryButton: {
          text: 'View Events',
          link: '/events'
        }
      }
    },
    {
      section: 'featured_bars',
      content: {
        title: 'Featured Bars',
        description: 'Experience the finest bars and lounges in the city'
      }
    },
    {
      section: 'featured_distilleries',
      content: {
        title: 'Premium Distilleries',
        description: 'Discover the finest craft spirit producers and their exceptional offerings'
      }
    },
    {
      section: 'featured_events',
      content: {
        title: 'Exclusive Events',
        description: 'Join premium tastings, masterclasses, and social gatherings'
      }
    },
    {
      section: 'featured_blogs',
      content: {
        title: 'Latest Blog Posts',
        description: 'Stay updated with the latest trends in nightlife, spirits, and entertainment'
      }
    }
  ];

  for (const sectionData of defaultSections) {
    const existing = await homepageRepository.findOne({
      where: { section: sectionData.section }
    });

    if (!existing) {
      const content = homepageRepository.create(sectionData);
      await homepageRepository.save(content);
      console.log(`✅ Homepage section '${sectionData.section}' initialized`);
    }
  }

  // Clear and recreate sample bars
  await barRepository.clear();
  console.log('🗑️ Cleared existing bars data');
  
  // Create sample bars
  const existingBars = await barRepository.count();
  if (existingBars === 0) {
    const sampleBars = [
      {
        name: 'Sky Lounge',
        type: 'Rooftop Bar',
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
        priceRange: '$$$',
        specialties: ['Cocktails', 'City View', 'Live Music'],
        description: 'Premium rooftop bar with stunning city views',
        address: '123 High Street, Mumbai',
        phone: '+91 98765 43210',
        website: 'https://skylounge.com',
        rating: 4.5,
        reviews: 128,
        isOpen: true,
        isActive: true,
      },
      {
        name: 'Whiskey Corner',
        type: 'Whiskey Bar',
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop',
        priceRange: '$$$$',
        specialties: ['Premium Whiskey', 'Cigar Lounge', 'Private Tastings'],
        description: 'Exclusive whiskey bar with rare collections',
        address: '456 Elite Avenue, Delhi',
        phone: '+91 98765 43211',
        website: 'https://whiskeycorner.com',
        rating: 4.8,
        reviews: 95,
        isOpen: true,
        isActive: true,
      },
      {
        name: 'Cocktail Lab',
        type: 'Cocktail Bar',
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        priceRange: '$$',
        specialties: ['Molecular Mixology', 'Custom Cocktails', 'Bar Games'],
        description: 'Innovative cocktail bar with experimental drinks',
        address: '789 Tech Park, Bangalore',
        phone: '+91 98765 43212',
        website: 'https://cocktaillab.com',
        rating: 4.3,
        reviews: 156,
        isOpen: true,
        isActive: true,
      }
    ];

    for (const barData of sampleBars) {
      const bar = barRepository.create(barData);
      await barRepository.save(bar);
    }
    console.log('✅ Sample bars created');
  }

  // Clear and recreate sample distilleries
  await distilleryRepository.clear();
  console.log('🗑️ Cleared existing distilleries data');
  
  // Create sample distilleries
  const existingDistilleries = await distilleryRepository.count();
  if (existingDistilleries === 0) {
    const sampleDistilleries = [
      {
        name: 'Golden Spirits Distillery',
        type: 'Whiskey Distillery',
        location: 'Goa',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
        priceRange: '$$$',
        specialties: ['Single Malt', 'Aged Whiskey', 'Tours'],
        established: '2015',
        description: 'Premium craft whiskey distillery with traditional methods',
        address: '321 Coastal Road, Goa',
        phone: '+91 98765 43213',
        website: 'https://goldenspirits.com',
        products: ['Golden Reserve', 'Coastal Blend', 'Heritage Malt'],
        rating: 4.7,
        reviews: 89,
        isOpen: true,
        isActive: true,
      },
      {
        name: 'Mountain Craft Distillery',
        type: 'Gin Distillery',
        location: 'Himachal Pradesh',
        image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=300&fit=crop',
        priceRange: '$$',
        specialties: ['Botanical Gin', 'Mountain Herbs', 'Small Batch'],
        established: '2018',
        description: 'Artisanal gin distillery using local mountain botanicals',
        address: '654 Hill Station, Himachal Pradesh',
        phone: '+91 98765 43214',
        website: 'https://mountaincraft.com',
        products: ['Mountain Gin', 'Herbal Blend', 'Premium Reserve'],
        rating: 4.4,
        reviews: 67,
        isOpen: true,
        isActive: true,
      }
    ];

    for (const distilleryData of sampleDistilleries) {
      const distillery = distilleryRepository.create(distilleryData);
      await distilleryRepository.save(distillery);
    }
    console.log('✅ Sample distilleries created');
  }

  // Clear and recreate sample events
  await eventRepository.clear();
  console.log('🗑️ Cleared existing events data');
  
  // Create sample events
  const existingEvents = await eventRepository.count();
  if (existingEvents === 0) {
    const sampleEvents = [
      {
        name: 'Whiskey Tasting Masterclass',
        type: 'Tasting Event',
        date: '2024-02-15',
        time: '19:00',
        location: 'Sky Lounge, Mumbai',
        image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=300&fit=crop',
        price: '₹2,500',
        capacity: '30',
        description: 'Learn about premium whiskeys from around the world',
        category: 'Education',
        fullDescription: 'Join our expert sommelier for an evening of whiskey appreciation. Taste 6 premium whiskeys and learn about their unique characteristics.',
        organizer: 'ByFoods Events',
        contactEmail: 'events@byfoods.com',
        contactPhone: '+91 98765 43215',
        requirements: ['Age 21+', 'Valid ID Required'],
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Cocktail Mixing Workshop',
        type: 'Workshop',
        date: '2024-02-20',
        time: '18:30',
        location: 'Cocktail Lab, Bangalore',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        price: '₹1,800',
        capacity: '25',
        description: 'Learn to create signature cocktails like a pro',
        category: 'Workshop',
        fullDescription: 'Hands-on workshop where you\'ll learn to create 4 signature cocktails using professional techniques.',
        organizer: 'ByFoods Events',
        contactEmail: 'events@byfoods.com',
        contactPhone: '+91 98765 43216',
        requirements: ['Age 18+', 'No prior experience needed'],
        isActive: true,
        isFeatured: false,
      }
    ];

    for (const eventData of sampleEvents) {
      const event = eventRepository.create(eventData);
      await eventRepository.save(event);
    }
    console.log('✅ Sample events created');
  }

  // Create sample blogs
  const existingBlogs = await blogRepository.count();
  if (existingBlogs === 0) {
    const sampleBlogs = [
      {
        title: 'The Art of Whiskey Tasting: A Beginner\'s Guide',
        excerpt: 'Learn the fundamentals of whiskey tasting and discover how to appreciate the complex flavors and aromas.',
        content: 'Whiskey tasting is an art that combines science, tradition, and personal preference...',
        author: 'John Smith',
        date: '2024-01-15',
        readTime: '5 min read',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=300&fit=crop',
        featured: true,
        isActive: true,
        tags: ['whiskey', 'tasting', 'beginner'],
        metaTitle: 'Whiskey Tasting Guide for Beginners',
        metaDescription: 'Complete guide to whiskey tasting for beginners',
        views: 1250,
      },
      {
        title: 'Top 10 Cocktail Bars in Mumbai',
        excerpt: 'Discover the best cocktail bars in Mumbai with our curated list of must-visit establishments.',
        content: 'Mumbai\'s nightlife scene is vibrant and diverse, offering some of the best cocktail experiences...',
        author: 'Sarah Johnson',
        date: '2024-01-10',
        readTime: '8 min read',
        category: 'Travel',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        featured: true,
        isActive: true,
        tags: ['mumbai', 'cocktails', 'bars', 'nightlife'],
        metaTitle: 'Best Cocktail Bars in Mumbai',
        metaDescription: 'Top cocktail bars in Mumbai for the perfect night out',
        views: 2100,
      },
      {
        title: 'Craft Distillery Tour: Behind the Scenes',
        excerpt: 'Take a virtual tour of a craft distillery and learn about the whiskey-making process.',
        content: 'Craft distilleries are revolutionizing the spirits industry with their attention to detail...',
        author: 'Mike Chen',
        date: '2024-01-05',
        readTime: '6 min read',
        category: 'Industry',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
        featured: false,
        isActive: true,
        tags: ['distillery', 'craft', 'whiskey', 'production'],
        metaTitle: 'Craft Distillery Tour Guide',
        metaDescription: 'Behind the scenes look at craft distillery operations',
        views: 890,
      }
    ];

    for (const blogData of sampleBlogs) {
      const blog = blogRepository.create(blogData);
      await blogRepository.save(blog);
    }
    console.log('✅ Sample blogs created');
  }

  console.log('🎉 Database seeding completed!');
}
