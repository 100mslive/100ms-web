import React from 'react';

const POSITIONS = {
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
}

const classesByPositions = {
  [POSITIONS.topLeft]: `absolute z-5 left-0 top-0`,
  [POSITIONS.topRight]: `absolute z-5 top-0 right-0`,
  [POSITIONS.bottomLeft]: `absolute z-5 bottom-0 left-0`,
  [POSITIONS.bottomRight]: `absolute z-5 bottom-0 right-0`
}

const DEFAULT_IMAGE = `https://s3.ap-south-1.amazonaws.com/wmall-reseller-group-content/saheli_group_37NTPFQ4GN_2022-01-10_1.png`;

const Watermark = ({
  src = DEFAULT_IMAGE,
  position = POSITIONS.bottomRight,
  ...props
}) => {
  const classToAdd = classesByPositions[position];
  return (
    <div className={`flex items-center py-2 z-50 ${classToAdd}`}>
      <span className='opacity-50 text-sm text-white px-2'>Powered by</span>
      <img className='h-auto' src={src} alt='watermark_nushop' />
    </div>
  )
}

export default Watermark;