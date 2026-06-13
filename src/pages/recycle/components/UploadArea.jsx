import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../utils/toast';

const ACCEPTED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp',
  '.tiff',
  '.tif',
  '.heic',
  '.gif',
];

const ACCEPTED_MIME = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/gif',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const isAcceptedFile = file => {
  const name = (file.name || '').toLowerCase();
  const ext = name.includes('.') ? name.substring(name.lastIndexOf('.')) : '';
  if (ACCEPTED_EXTENSIONS.includes(ext)) return true;
  if (ACCEPTED_MIME.includes(file.type)) return true;
  return false;
};

const UploadArea = ({ onFilesSelected, disabled = false, maxFiles = 2 }) => {
  const { t, i18n } = useTranslation();
  const toastPosition = i18n.language === 'ar' ? 'top-start' : 'top-end';
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = fileList => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(0, maxFiles);

    for (const file of files) {
      if (!isAcceptedFile(file)) {
        showToast(
          'error',
          t('recycle.unsupportedFileType', {
            types: ACCEPTED_EXTENSIONS.join(', '),
          }),
          toastPosition,
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showToast(
          'error',
          t('recycle.fileTooLarge', { name: file.name }),
          toastPosition,
        );
        return;
      }
    }

    onFilesSelected(files);
  };

  const onInputChange = e => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const svgBorder = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%23FF8A3D'/%3e%3cstop offset='50%25' stop-color='%2340B9FF'/%3e%3cstop offset='100%25' stop-color='%238ED321'/%3e%3c%2flinearGradient%3e%3c%2fdefs%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='url(%23g)' stroke-width='3' stroke-dasharray='6%2c4' stroke-linecap='round'/%3e%3c%2fsvg%3e")`;

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            inputRef.current?.click();
          }
        }}
        className={`relative w-full max-w-6xl mx-auto rounded-3xl cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          minHeight: '320px',
          backgroundColor: 'var(--background)',
          borderRadius: '24px',
          transform: isDragging ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: isDragging
            ? '0 10px 25px rgba(0,0,0,0.1)'
            : '0 1px 2px rgba(0,0,0,0.05)',
          backgroundImage: svgBorder,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
      >
        <div className="flex flex-col items-center justify-center px-6 py-16 sm:py-20 text-center">
          <svg
            width="33"
            height="24"
            viewBox="0 0 33 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 24C5.975 24 4.03125 23.2125 2.41875 21.6375C0.80625 20.0625 0 18.1375 0 15.8625C0 13.9125 0.5875 12.175 1.7625 10.65C2.9375 9.125 4.475 8.15 6.375 7.725C7 5.425 8.25 3.5625 10.125 2.1375C12 0.7125 14.125 0 16.5 0C19.425 0 21.9062 1.01875 23.9438 3.05625C25.9813 5.09375 27 7.575 27 10.5C28.725 10.7 30.1562 11.4437 31.2938 12.7312C32.4313 14.0188 33 15.525 33 17.25C33 19.125 32.3438 20.7188 31.0312 22.0312C29.7188 23.3438 28.125 24 26.25 24H18C17.175 24 16.4688 23.7062 15.8813 23.1187C15.2938 22.5312 15 21.825 15 21V13.275L12.6 15.6L10.5 13.5L16.5 7.5L22.5 13.5L20.4 15.6L18 13.275V21H26.25C27.3 21 28.1875 20.6375 28.9125 19.9125C29.6375 19.1875 30 18.3 30 17.25C30 16.2 29.6375 15.3125 28.9125 14.5875C28.1875 13.8625 27.3 13.5 26.25 13.5H24V10.5C24 8.425 23.2687 6.65625 21.8062 5.19375C20.3438 3.73125 18.575 3 16.5 3C14.425 3 12.6562 3.73125 11.1938 5.19375C9.73125 6.65625 9 8.425 9 10.5H8.25C6.8 10.5 5.5625 11.0125 4.5375 12.0375C3.5125 13.0625 3 14.3 3 15.75C3 17.2 3.5125 18.4375 4.5375 19.4625C5.5625 20.4875 6.8 21 8.25 21H12V24H8.25Z"
              fill="var(--Icon-Disabled)"
            />
          </svg>

          <p
            className="mt-3 text-sm sm:text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('recycle.clickOrDrag')}
          </p>

          <p
            className="text-sm sm:text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('recycle.imagesHere')}
          </p>

          <p
            className="mt-3 text-xs"
            style={{ color: 'var(--Disabled-Text-color)' }}
          >
            {t('recycle.uploadInfo', { max: maxFiles })}
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          multiple
          onChange={onInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default UploadArea;
