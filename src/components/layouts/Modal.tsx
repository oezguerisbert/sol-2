import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
interface IModal {
  state: 'open' | 'close';
  setState: any;
  title: string;
}

const Modal: React.FC<IModal> = ({ state, setState, title = '', children }) => {
  const cancelButtonRef = useRef();

  const closeModal = () => {
    setState(false);
  };

  const openModal = () => {
    setState(true);
  };

  return (
    <Transition show={state == 'open'} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        initialFocus={cancelButtonRef}
        static
        open={state == 'open'}
        onClose={closeModal}
      >
        <div className='min-h-screen px-4 text-center'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl'>
              <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'>
                {title}
              </Dialog.Title>
              <div className='mt-2 pb-4'>{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
export default Modal;
