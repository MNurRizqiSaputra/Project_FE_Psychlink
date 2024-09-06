import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GrupPasien() {
    const [grups, setGrups] = useState([]);

    useEffect(() => {
        fetchGrups();
    }, []);

    const fetchGrups = async () => {
        try {
            const response = await axios.get('http://localhost:3000/grups');
            setGrups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="mb-6 text-4xl font-bold">Grup/Komunitas</h2>
                    <p className="text-lg text-gray-700">
                        Temukan dan ikuti grup/komunitas yang Anda butuhkan untuk berbagi informasi terkait kesehatan mental.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {grups.map((group) => (
                        <div key={group.id} className="p-6 bg-white rounded-lg shadow-xl relative hover:shadow-2xl">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                                <p className="text-sm text-gray-600 description" style={{ wordWrap: 'break-word' }}>{group.description}</p>
                                <img src={group.imageUrl} alt={group.name} className="mt-4 mx-auto rounded-lg" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                            </div>
                            <div className="flex justify-center mt-4 space-x-4">
                                {group.platform === 'instagram' && (
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-white bg-pink-600 rounded hover:bg-pink-700"
                                    >
                                        Instagram
                                    </a>
                                )}
                                {group.platform === 'whatsapp' && (
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                                    >
                                        WhatsApp
                                    </a>
                                )}
                                {group.platform === 'telegram' && (
                                    <a
                                        href={group.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                    >
                                        Telegram
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GrupPasien;
