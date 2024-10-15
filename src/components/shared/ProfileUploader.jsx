import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { convertFileToUrl } from '@/utilities/utils';

const ProfileUploader = ({ fieldChange, mediaURL }) => {
  const [file, setFile] = useState([]);
  const [fileURL, setFileURL] = useState(mediaURL);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileURL(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.gif'],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-poointer" />

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileURL || '/assets/icons/profile-placeholder.svg'}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />

        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
