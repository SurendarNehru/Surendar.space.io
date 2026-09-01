ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url text;

DELETE FROM public.projects;

INSERT INTO public.projects (name, description, tag, url, image_url, sort_order) VALUES
('01 — SwapIt',
'Secure Campus-Based Student Exchange Platform

SwapIt is a dedicated digital marketplace designed for university students to buy, sell, and exchange products within a verified campus community.

Key Features
• Verified student-only access
• Product listing with images and descriptions
• Search and filtering
• Firebase Authentication
• Firebase Storage
• Buyer–seller communication
• Secure campus-based trading
• Encourages reuse and sustainable consumption

Technology
HTML5 · CSS3 · JavaScript · Tailwind CSS · Express.js · MongoDB · Firebase',
'Marketplace', 'https://github.com/SurendarNehru',
'/__l5e/assets-v1/1edb384d-0b56-42cf-9cb0-87c335a553ad/proj-swapit.jpg', 1),

('02 — Care Connect',
'Doctor Home Visit Booking Platform

Care Connect is a digital healthcare platform that allows patients to discover verified doctors and schedule medical consultations at home.

Key Features
• Doctor verification
• Specialization-based search
• Location-based doctor discovery
• Appointment booking
• Appointment approval and rescheduling
• Patient–doctor communication
• Ratings and feedback
• Firebase authentication
• Role-based access

Technology
Java · XML · Android Studio · Firebase Authentication · Firestore · Realtime Database',
'Healthcare', 'https://github.com/SurendarNehru',
'/__l5e/assets-v1/af9030c1-3ef3-48db-92ed-0b763fb0e555/proj-careconnect.jpg', 2),

('03 — EyeCursor',
'Controlling Cursor With Eye Movements

EyeCursor is an assistive computer-vision system that enables users to control their computer cursor using eye movements captured through a standard webcam.

Key Features
• Real-time eye tracking
• Hands-free cursor movement
• Eye-gesture clicking
• Facial landmark detection
• Webcam-based operation
• Accessibility-focused interaction
• Minimal hardware requirements

Technology
Python · OpenCV · MediaPipe · PyAutoGUI · Computer Vision',
'Computer Vision', 'https://github.com/SurendarNehru',
'/__l5e/assets-v1/f9b1daa3-a2c7-4414-9c95-719310bf6e8b/proj-eyecursor.jpg', 3),

('04 — My Portfolio',
'Personal Developer Portfolio

A modern personal portfolio designed and developed to showcase my projects, technical skills, experience, achievements, and development journey.

Key Features
• Responsive portfolio design
• Project showcase
• About section
• Skills and technologies
• Experience and achievements
• Contact section
• GitHub and professional links
• Interactive navigation
• Modern animations and visual effects

Technology
React · JavaScript · HTML · CSS · Tailwind CSS · Vercel',
'Portfolio', 'https://github.com/SurendarNehru',
'/__l5e/assets-v1/f8cbc4b6-ac4e-48ce-8a27-9478e308d621/proj-portfolio.jpg', 4);

INSERT INTO public.site_content (key, value) VALUES
('contact_email', 'surendarnehru2004@gmail.com'),
('contact_github', 'https://github.com/SurendarNehru'),
('contact_linkedin', 'https://www.linkedin.com/in/surendar-n-55a8482a1'),
('contact_instagram', 'https://www.instagram.com/sanz.______?igsh=b2xsY2pwcWQzOGJh')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();