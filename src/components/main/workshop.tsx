import React from 'react';

const Workshop = () => {
  const events = [
    {
      title: 'Kelas Belajar Bahasa Isyarat',
      date: '23 November 2023',
      location: '',
      description: 'Kelas belajar bahasa isyarat untuk memperkenalkan komunikasi kepada orang-orang yang ingin belajar lebih dalam.',
      image: "/assets/workshop/workshop (1).png",
    },
    {
      title: 'One Fun Day With Deaf Friend',
      date: '26 November 2023',
      location: 'Jogja',
      description: 'Bersama teman-teman tuli, kegiatan ini bertujuan untuk meningkatkan kesadaran akan budaya tuli.',
      image: "/assets/workshop/workshop (2).png",
    },
    {
      title: 'EMPOWERING TOGETHER',
      date: '28 November 2023',
      location: 'Bandung',
      description: 'Kegiatan untuk meningkatkan kesadaran dan empati terhadap individu tuli dalam komunitas.',
      image: "/assets/workshop/workshop (3).png",
    },
    {
      title: 'Art of Deaf Leadership #3',
      date: '',
      location: '',
      description: 'Kegiatan untuk mengembangkan kemampuan kepemimpinan dalam komunitas tuli.',
      image: "/assets/workshop/workshop (2).png",
    },
       {
      title: 'Kelas Belajar Bahasa Isyarat',
      date: '23 November 2023',
      location: '',
      description: 'Kelas belajar bahasa isyarat untuk memperkenalkan komunikasi kepada orang-orang yang ingin belajar lebih dalam.',
      image: "/assets/workshop/workshop (1).png",
    },
    {
      title: 'One Fun Day With Deaf Friend',
      date: '26 November 2023',
      location: 'Jogja',
      description: 'Bersama teman-teman tuli, kegiatan ini bertujuan untuk meningkatkan kesadaran akan budaya tuli.',
      image: "/assets/workshop/workshop (2).png",
    },
    {
      title: 'EMPOWERING TOGETHER',
      date: '28 November 2023',
      location: 'Bandung',
      description: 'Kegiatan untuk meningkatkan kesadaran dan empati terhadap individu tuli dalam komunitas.',
      image: "/assets/workshop/workshop (3).png",
    },
    {
      title: 'Art of Deaf Leadership #3',
      date: '',
      location: '',
      description: 'Kegiatan untuk mengembangkan kemampuan kepemimpinan dalam komunitas tuli.',
      image: "/assets/workshop/workshop (2).png",
    },
  ];

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-6">Ikuti untuk menambah skill Bahasa Isyarat mu!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {event.date} {event.location && `| ${event.location}`}
              </p>
              <p className="text-sm text-gray-700">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workshop;
