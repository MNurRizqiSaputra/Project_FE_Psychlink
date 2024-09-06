import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";

function GrupAdmin() {
    const [grups, setGrups] = useState([]);
    const [newGroup, setNewGroup] = useState({
        name: '',
        description: '',
        platform: '',
        link: '',
        imageUrl: ''
    });
    const [editingGroup, setEditingGroup] = useState(null); // State untuk menyimpan data grup yang sedang diedit
    const [editMode, setEditMode] = useState(false); // State untuk mengontrol tampilan form edit

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

    const handleCreateGroup = async (newGroup) => {
        try {
            const response = await axios.post('http://localhost:3000/grups', newGroup);
            setGrups([...grups, response.data]);
            Swal.fire('Success', 'Grup berhasil ditambahkan', 'success');
        } catch (error) {
            console.error('Error creating group:', error);
            Swal.fire('Error', 'Grup gagal ditambahkan', 'error');
        }
    };

    const handleDeleteGroup = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/grups/${id}`);
            setGrups(grups.filter(group => group.id !== id));
            Swal.fire('Success', 'Grup berhasil dihapus', 'success');
        } catch (error) {
            console.error('Error deleting group:', error);
            Swal.fire('Error', 'Grup gagal dihapus', 'error');
        }
    };

    const handleEditGroup = async (id, updatedGroup) => {
        try {
            const response = await axios.put(`http://localhost:3000/grups/${id}`, updatedGroup);
            const updatedGrups = grups.map(group => (group.id === id ? response.data : group));
            setGrups(updatedGrups);
            setEditingGroup(null);
            setEditMode(false);
            Swal.fire('Success', 'Grup berhasil diupdate', 'success');
        } catch (error) {
            console.error('Error updating group:', error);
            Swal.fire('Error', 'Grup gagal diupdate', 'error');
        }
    };

    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="mb-6 text-4xl font-bold">Manajemen Grup/Komunitas</h2>
                    <p className="text-lg text-gray-700">
                        Kelola semua grup/komunitas yang terkait untuk berbagi informasi terkait kesehatan mental.
                    </p>
                </div>

                <div className="mb-6 text-center">
                    <button
                        onClick={() => Swal.fire({
                            title: 'Buat Grup',
                            html: `
                                <input type="text" id="name" class="swal2-input" placeholder="Nama grup">
                                <input type="text" id="description" class="swal2-input" placeholder="Deskripsi grup">
                                <select id="platform" class="swal2-select" placeholder="Pilih Platform" readonly>
                                    <option value="" readonly>Pilih Platform</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="telegram">Telegram</option>
                                </select>
                                <input type="text" id="link" class="swal2-input" placeholder="Link">
                                <input type="text" id="imageUrl" class="swal2-input" placeholder="URL Gambar">
                            `,
                            confirmButtonText: 'Buat',
                            showCancelButton: true,
                            preConfirm: () => {
                                const name = Swal.getPopup().querySelector('#name').value;
                                const description = Swal.getPopup().querySelector('#description').value;
                                const platform = Swal.getPopup().querySelector('#platform').value;
                                const link = Swal.getPopup().querySelector('#link').value;
                                const imageUrl = Swal.getPopup().querySelector('#imageUrl').value;
                                if (!name || !description || !platform || !link || !imageUrl) {
                                    Swal.showValidationMessage(`Please enter name, description, platform, link, and image URL`);
                                }
                                return { name, description, platform, link, imageUrl };
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleCreateGroup(result.value);
                            }
                        })}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Buat Grup
                    </button>
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
                                <button
                                    onClick={() => {
                                        setEditingGroup(group);
                                        setEditMode(true);
                                        Swal.fire({
                                            title: 'Edit Grup',
                                            html: `
                                                <input type="text" id="edit-name" class="swal2-input" placeholder="Nama grup" value="${group.name}">
                                                <input type="text" id="edit-description" class="swal2-input" placeholder="Deskripsi grup" value="${group.description}">
                                                <select id="edit-platform" class="swal2-select" placeholder="Pilih Platform" readonly>
                                                    <option value="instagram" ${group.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                                                    <option value="whatsapp" ${group.platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                                                    <option value="telegram" ${group.platform === 'telegram' ? 'selected' : ''}>Telegram</option>
                                                </select>
                                                <input type="text" id="edit-link" class="swal2-input" placeholder="Link" value="${group.link}">
                                                <input type="text" id="edit-imageUrl" class="swal2-input" placeholder="URL Gambar" value="${group.imageUrl}">
                                            `,
                                            confirmButtonText: 'Simpan',
                                            showCancelButton: true,
                                            preConfirm: () => {
                                                const name = Swal.getPopup().querySelector('#edit-name').value;
                                                const description = Swal.getPopup().querySelector('#edit-description').value;
                                                const platform = Swal.getPopup().querySelector('#edit-platform').value;
                                                const link = Swal.getPopup().querySelector('#edit-link').value;
                                                const imageUrl = Swal.getPopup().querySelector('#edit-imageUrl').value;
                                                if (!name || !description || !platform || !link || !imageUrl) {
                                                    Swal.showValidationMessage(`Please enter name, description, platform, link, and image URL`);
                                                }
                                                return { name, description, platform, link, imageUrl };
                                            }
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                handleEditGroup(group.id, result.value);
                                            }
                                        });
                                    }}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="text-red-500 hover:text-red-800"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GrupAdmin;
