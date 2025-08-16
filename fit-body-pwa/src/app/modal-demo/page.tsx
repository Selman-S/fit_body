'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Modal, { 
  ModalHeader, 
  ModalContent, 
  ModalFooter, 
  ConfirmationModal, 
  AlertModal 
} from '@/components/ui/Modal';

export default function ModalDemoPage() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [fullScreenModalOpen, setFullScreenModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [animationModalOpen, setAnimationModalOpen] = useState(false);

  const handleDelete = () => {
    console.log('Delete confirmed!');
    // Simulate API call
    setTimeout(() => {
      setConfirmationModalOpen(false);
    }, 1000);
  };

  const handleSuccess = () => {
    console.log('Success action!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Modal Component Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test different modal variants, sizes, and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Basic Modal</CardTitle>
              <CardDescription>Simple modal with title and content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setBasicModalOpen(true)}
                variant="primary"
                fullWidth
              >
                Open Basic Modal
              </Button>
            </CardContent>
          </Card>

          {/* Large Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Large Modal</CardTitle>
              <CardDescription>Modal with large size and custom content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setLargeModalOpen(true)}
                variant="secondary"
                fullWidth
              >
                Open Large Modal
              </Button>
            </CardContent>
          </Card>

          {/* Full Screen Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Full Screen Modal</CardTitle>
              <CardDescription>Modal that takes the entire screen</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setFullScreenModalOpen(true)}
                variant="outline"
                fullWidth
              >
                Open Full Screen
              </Button>
            </CardContent>
          </Card>

          {/* Confirmation Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Confirmation Modal</CardTitle>
              <CardDescription>Modal for user confirmations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setConfirmationModalOpen(true)}
                variant="destructive"
                fullWidth
              >
                Delete Item
              </Button>
            </CardContent>
          </Card>

          {/* Alert Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Alert Modal</CardTitle>
              <CardDescription>Modal for showing alerts and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setAlertModalOpen(true)}
                variant="success"
                fullWidth
              >
                Show Success Alert
              </Button>
            </CardContent>
          </Card>

          {/* Custom Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Custom Modal</CardTitle>
              <CardDescription>Modal with custom styling and layout</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setCustomModalOpen(true)}
                variant="ghost"
                fullWidth
              >
                Open Custom Modal
              </Button>
            </CardContent>
          </Card>

          {/* Position Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Position Modal</CardTitle>
              <CardDescription>Modal with different positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setPositionModalOpen(true)}
                variant="warning"
                fullWidth
              >
                Open Top Modal
              </Button>
            </CardContent>
          </Card>

          {/* Animation Modal */}
          <Card variant="default" size="md">
            <CardHeader>
              <CardTitle>Animation Modal</CardTitle>
              <CardDescription>Modal with different animations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setAnimationModalOpen(true)}
                variant="outline"
                fullWidth
              >
                Open Animated Modal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Basic Modal */}
        <Modal
          isOpen={basicModalOpen}
          onClose={() => setBasicModalOpen(false)}
          title="Basic Modal"
          description="This is a simple modal with basic content"
          size="md"
        >
          <ModalContent>
            <p className="text-gray-700 dark:text-gray-300">
              This modal demonstrates the basic functionality with a title, description, and content area.
              You can customize the size, variant, and other properties as needed.
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Responsive design</li>
                <li>• Dark mode support</li>
                <li>• Keyboard navigation (ESC to close)</li>
                <li>• Focus management</li>
                <li>• Backdrop click to close</li>
              </ul>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" onClick={() => setBasicModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setBasicModalOpen(false)}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>

        {/* Large Modal */}
        <Modal
          isOpen={largeModalOpen}
          onClose={() => setLargeModalOpen(false)}
          title="Large Modal Example"
          description="This modal demonstrates a larger size with more content"
          size="3xl"
          variant="elevated"
        >
          <ModalContent>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This is a larger modal that can accommodate more content. It&apos;s perfect for forms,
                detailed information, or complex layouts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Section 1</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This section contains important information about the first topic.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Section 2</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    This section contains important information about the second topic.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Information</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can add any type of content here, including forms, tables, charts, or other components.
                </p>
              </div>
            </div>
          </ModalContent>
          <ModalFooter align="between">
            <Button variant="ghost" onClick={() => setLargeModalOpen(false)}>
              Skip
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setLargeModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setLargeModalOpen(false)}>
                Continue
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        {/* Full Screen Modal */}
        <Modal
          isOpen={fullScreenModalOpen}
          onClose={() => setFullScreenModalOpen(false)}
          title="Full Screen Modal"
          description="This modal takes up the entire screen"
          fullScreen={true}
          variant="glass"
          showCloseButton={true}
        >
          <ModalContent>
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to Full Screen Mode
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  This modal demonstrates how you can create immersive experiences
                  that take advantage of the entire screen space.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Optimized for performance
                  </p>
                </div>
                
                <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Beautiful</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Modern design system
                  </p>
                </div>
                
                <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Responsive</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Works on all devices
                  </p>
                </div>
              </div>

              <p className="text-gray-500 dark:text-gray-400">
                Use the close button or press ESC to exit full screen mode.
              </p>
            </div>
          </ModalContent>
        </Modal>

        {/* Custom Modal */}
        <Modal
          isOpen={customModalOpen}
          onClose={() => setCustomModalOpen(false)}
          size="2xl"
          variant="outline"
          showCloseButton={false}
          closeOnBackdropClick={false}
          className="border-4 border-purple-500"
          contentClassName="p-8"
        >
          <ModalHeader
            title="Custom Styled Modal"
            description="This modal has custom styling and behavior"
            onClose={() => setCustomModalOpen(false)}
            showCloseButton={true}
            className="border-b-2 border-purple-200 pb-4"
          />
          <ModalContent>
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-4">
                Custom Modal Design
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This modal demonstrates custom styling with purple borders, custom padding,
                and disabled backdrop click. You can customize any aspect of the modal!
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    Custom Border
                  </span>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    Custom Padding
                  </span>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    No Backdrop Click
                  </span>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="font-medium text-purple-700 dark:text-purple-300">
                    Custom Variant
                  </span>
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalFooter align="center">
            <Button 
              variant="outline" 
              onClick={() => setCustomModalOpen(false)}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Position Modal */}
        <Modal
          isOpen={positionModalOpen}
          onClose={() => setPositionModalOpen(false)}
          title="Top Position Modal"
          description="This modal appears at the top of the screen"
          size="lg"
          position="top"
          variant="elevated"
        >
          <ModalContent>
            <p className="text-gray-700 dark:text-gray-300">
              This modal demonstrates the top position variant. It appears at the top of the screen
              instead of the center, which can be useful for notifications or quick actions.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Tip:</strong> Top position modals are great for alerts, notifications,
                or quick forms that don&apos;t require the user&apos;s full attention.
              </p>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="warning" onClick={() => setPositionModalOpen(false)}>
              Got it!
            </Button>
          </ModalFooter>
        </Modal>

        {/* Animation Modal */}
        <Modal
          isOpen={animationModalOpen}
          onClose={() => setAnimationModalOpen(false)}
          title="Animated Modal"
          description="This modal demonstrates different animation effects"
          size="md"
          animation="slide"
          variant="glass"
        >
          <ModalContent>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This modal uses the slide animation effect. You can also try:
              </p>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="font-medium">fade</span> - Smooth fade in/out
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="font-medium">scale</span> - Scale up/down effect
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <span className="font-medium">slide</span> - Slide up/down effect
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-medium">none</span> - No animation
                </div>
              </div>
            </div>
          </ModalContent>
          <ModalFooter align="center">
            <Button variant="primary" onClick={() => setAnimationModalOpen(false)}>
              Awesome!
            </Button>
          </ModalFooter>
        </Modal>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={handleDelete}
          size="md"
        />

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          message="Your changes have been saved successfully!"
          type="success"
          actionText="Great!"
          onAction={handleSuccess}
          size="sm"
        />
      </div>
    </div>
  );
}
