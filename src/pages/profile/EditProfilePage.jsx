import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserApi, updateProfileApi, deleteUserAccountApi, updateUserImageApi, deleteUserImageApi } from '../../api/userApi';
import { getAvatarByIdApi } from '../../api/avatarApi';
import { Camera, UserPlus, Lock, SquarePen, AlertTriangle, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { showToast } from '../../utils/toast';
export default function EditProfilePage() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('Male');
    const [userImage, setUserImage] = useState('');
    const [userImageFile, setUserImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const userId = user?.id || user?._id;

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await getUserApi(userId);
                const apiUser = res.data?.user ?? res.data;
                const profile = apiUser?.profile ?? {};

                setFirstName(profile.first_name || '');
                setLastName(profile.last_name || '');
                setEmail(apiUser?.email || '');
                setGender(profile.gender || 'Male');
                setUserImage(apiUser?.userImage || '');
                setImagePreview(apiUser?.userImage || '');
            } catch (error) {
                console.error('Failed to load user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    useEffect(() => {
        return () => {
            if (userImageFile && imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [userImageFile, imagePreview]);

    useEffect(() => {
        const ids = user?.avatars;
        if (!ids?.length) return;

        let cancelled = false;
        setAvatarLoading(true);

        getAvatarByIdApi(ids[0])
            .then((res) => {
                if (cancelled) return;
                const url = res.data?.avatar?.image_url ?? null;
                setAvatarUrl(url);
            })
            .catch(() => {
                if (!cancelled) setAvatarUrl(null);
            })
            .finally(() => {
                if (!cancelled) setAvatarLoading(false);
            });

        return () => { cancelled = true; };
    }, [user]);

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setUserImageFile(file);
        setUploadingImage(true);

        try {
            const toBase64 = (f) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(f);
                });

            const base64 = await toBase64(file);
            const res = await updateUserImageApi(base64);
            const newImageUrl = res.data?.userImage || res.data?.imageUrl || res.data?.url || '';

            if (newImageUrl) {
                URL.revokeObjectURL(previewUrl);
                setUserImage(newImageUrl);
                setImagePreview(newImageUrl);
                setUserImageFile(null);
                login({ ...user, userImage: newImageUrl });
            }

            showToast('success', 'Profile image updated');
        } catch (error) {
            console.error('Failed to upload image:', error);
            URL.revokeObjectURL(previewUrl);
            setImagePreview(userImage || '');
            showToast('error', error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
            event.target.value = '';
        }
    };

    const handleImageRemove = async () => {
        const result = await Swal.fire({
            title: 'Remove Profile Image?',
            text: 'Your profile picture will be removed.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUserImageApi();
            setUserImage('');
            setImagePreview('');
            setUserImageFile(null);
            login({ ...user, userImage: '' });

            showToast('success', 'Profile image removed');
        } catch (error) {
            console.error('Failed to remove image:', error);
            showToast('error', error.response?.data?.message || 'Failed to remove image');
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (!email) {
            return Swal.fire({
                icon: 'warning',
                title: 'Email Required',
                text: 'Email is required to delete account.',
            });
        }

        const result = await Swal.fire({
            title: 'Delete Account?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        setDeleting(true);
        try {
            await deleteUserAccountApi(email);
            showToast('success', 'Your account has been deleted successfully.');

            logout();
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
            showToast('error', error.response?.data?.message || 'Failed to delete account');
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);

        try {
            const profileData = {
                firstName,
                lastName,
                gender,
                email,
            };

            const profileRes = await updateProfileApi(profileData);
            const updatedUser = profileRes.data?.user ?? profileRes.data;
            const updatedImage = updatedUser?.userImage || updatedUser?.image || imagePreview || userImage;
            const updatedName = [firstName, lastName].filter(Boolean).join(" ").trim();

            login({
                ...user,
                email,
                userImage: updatedImage,
                firstName,
                lastName,
                name: updatedName,
                profile: {
                    ...(user?.profile || {}),
                    first_name: firstName,
                    last_name: lastName,
                    gender,
                },
            });
            setUserImage(updatedImage);
            setImagePreview(updatedImage);

            if (login) {
                login({
                    ...user,
                    email,
                    userImage: updatedImage,
                    firstName,
                    lastName,
                    name: updatedName,
                    profile: {
                        ...(user?.profile || {}),
                        first_name: firstName,
                        last_name: lastName,
                        gender,
                    },
                });
            }

            showToast('success', 'Profile updated successfully');
        } catch (error) {
            console.error('Failed to save profile:', error);
            showToast('error', error.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Your Name';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans flex items-center justify-center">
                <span className="text-gray-500">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans flex flex-col items-center gap-8">

            {/* Top Cards Section */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">

                {/* Profile Card */}
                <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-[#DDF1FF] flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt={`${firstName} ${lastName}'s profile picture`}
                                    className="w-full h-full object-cover"
                                    onError={() => setImagePreview('')}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                    {firstName ? (
                                        <span className="text-4xl font-bold text-[#40B9FF]">
                                            {firstName.charAt(0).toUpperCase()}
                                        </span>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-16 h-16 text-[#8BB8D8]"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>

                        {uploadingImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                            </div>
                        )}

                        <input
                            id="profileImageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImage}
                            onChange={handleImageChange}
                        />

                        <label
                            htmlFor="profileImageUpload"
                            className={`absolute bottom-1 right-1 bg-[var(--Primary-Brand-color)] p-2 rounded-full border-4 border-white shadow-sm transition-transform cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        >
                            <Camera className="text-white w-5 h-5" />
                        </label>

                        {userImage && !uploadingImage && (
                            <button
                                type="button"
                                onClick={handleImageRemove}
                                className="absolute top-1 right-1 bg-white p-1.5 rounded-full border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            >
                                <Trash2 className="text-red-500 w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
                    <p className="text-gray-400 text-xs mt-1 font-medium">Click the camera icon to change photo</p>
                </div>

                {/* Avatar Card */}
                <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    {avatarLoading ? (
                        <div className="w-full py-12 flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                        </div>
                    ) : avatarUrl ? (
                        <>
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold mb-4">Your Avatar</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/avatar')}
                                    className="bg-[var(--color-brand-secondary)] text-white px-8 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90"
                                >
                                    Edit
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                onClick={() => navigate('/avatar')}
                                className="cursor-pointer"
                            >
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 bg-[#DDF1FF] rounded-full flex items-center justify-center">
                                        <UserPlus className="w-12 h-12 text-[#40B9FF]" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold mb-4">Create your Avatar</p>
                            <button
                                onClick={() => navigate('/avatar')}
                                className="bg-[var(--color-brand-secondary)] text-white px-8 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90"
                            >
                                Create
                            </button>
                        </>
                    )}
                </div>

            </div>

            {/* Main Personal Information Form */}
            <div className="w-full max-w-5xl bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-800 mb-10 ">Personal Information</h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">First Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#40B9FF]/20"
                                />
                                <SquarePen className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Last Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-gray-700 font-medium focus:ring-2 focus:ring-[#40B9FF]/20"
                                />
                                <SquarePen className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Email Row */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl p-4 pl-12 text-gray-700 font-medium focus:ring-2 focus:ring-[#40B9FF]/20"
                            />
                        </div>
                    </div>

                    {/* Gender Row */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 ">Gender</label>
                        <div className="flex gap-4 mt-1">
                            <button
                                type="button"
                                onClick={() => setGender('Male')}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm ${gender === 'Male' ? 'bg-[var(--Primary-Brand-color)] text-white' : 'bg-gray-50 text-gray-400'}`}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('Female')}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm ${gender === 'Female' ? 'bg-[#40B9FF] text-white' : 'bg-gray-50 text-gray-400'}`}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-10"></div>

                    {/* Bottom Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <button type="button" onClick={handleCancel} className="flex-1 bg-white border border-gray-200 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-[var(--color-brand-secondary)] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Danger Zone Button */}
                    <div className="pt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="w-full md:w-auto px-16 py-4 bg-[#fcf3ed] text-[var(--Secondary-Orange-Brand-color)] rounded-2xl font-bold flex items-center justify-center gap-3 border border-[#FFE0E3] hover:bg-[#fff0e0] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            {deleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}