"use client"

import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useState } from 'react'

// Utility function to format file size
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function FileUploader({onFileSelect}) {
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0] || null;
        setUploadedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop, 
        multiple: false,
        accept: {'application/pdf' : ['.pdf']},
        maxSize: 20 * 1024 * 1024,
    });

    const removeFile = (e) => {
        e.stopPropagation();
        setUploadedFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className='w-full gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                
                <div className="space-y-4 cursor-pointer">
                    {uploadedFile ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <img src="/icons/info.svg" alt="" className='size-8' />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {uploadedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatSize(uploadedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700 text-xl font-bold"
                                type="button"
                                aria-label="Remove file"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                                <img src="/icons/info.svg" alt="" className='size-20' />
                            </div>
                            <div className=''>
                                <p className='text-lg text-gray-500 text-center'>
                                    <span className='font-bold '>Click to upload </span>
                                    or drag and drop
                                </p>
                                <p className='text-lg text-gray-500 text-center'>
                                    PDF (max 20 MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader