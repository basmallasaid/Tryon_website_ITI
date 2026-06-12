import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Camera, Loader2 } from 'lucide-react';
import { analyzeImageApi } from '../../api/userApi';

const AddItemModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setAnalyzing(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const res = await analyzeImageApi(formData);
            const analysisResult = res.data;
            const analysisId = analysisResult.analysis_id || analysisResult.id || analysisResult._id;
            onClose();
            navigate('/wardeobe/edit/new', {
                state: { analysisId, analysisResult, imageFile: selectedFile }
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-black text-gray-900 text-center mb-5 pt-2">
                    Upload & Analyze
                </h2>

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[3/2] bg-gray-100 border-3 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#40B9FF] transition-colors overflow-hidden relative"
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain" // تم التغيير هنا من cover لـ contain
                        />
                    ) : (
                        <>
                            <Camera size={36} className="text-gray-300" />
                            <span className="font-bold text-sm text-gray-400">Click to upload</span>
                        </>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />

                {error && (
                    <p className="text-red-500 text-xs font-bold mt-3 text-center">{error}</p>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || analyzing}
                    className="w-full bg-[#40B9FF] text-white py-3.5 rounded-xl font-black shadow-md shadow-blue-100 uppercase tracking-widest text-sm mt-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {analyzing ? (
                        <><Loader2 className="animate-spin" size={18} /> Analyzing...</>
                    ) : (
                        'Analyze & Add'
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddItemModal;
