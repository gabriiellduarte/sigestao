import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    show: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full'
};

export default function Modal({ 
    show, 
    onClose, 
    children, 
    title,
    description,
    size = 'md'
}: PropsWithChildren<Props>) {
    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel 
                                className={cn(
                                    "relative w-full transform overflow-hidden rounded-lg bg-background p-6 text-left align-middle shadow-xl transition-all",
                                    sizeClasses[size]
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    {title && (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-none tracking-tight"
                                        >
                                            {title}
                                        </Dialog.Title>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Fechar</span>
                                    </button>
                                </div>

                                {description && (
                                    <Dialog.Description className="text-sm text-muted-foreground mb-4">
                                        {description}
                                    </Dialog.Description>
                                )}

                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 