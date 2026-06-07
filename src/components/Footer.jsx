import GlobeIcon from '../icons/GlobeIcon';
import ShareIcon from '../icons/ShareIcon';
import AtSignIcon from '../icons/AtSignIcon';
import CameraIcon from '../icons/CameraIcon';
import VideoIcon from '../icons/VideoIcon';
import MailIcon from '../icons/MailIcon';

const platformLinks = ['Style Guide', 'Try-On Tech', 'Features'];

const socialIcons = [
  { icon: GlobeIcon, href: '#', label: 'Website' },
  { icon: ShareIcon, href: '#', label: 'Share' },
  { icon: AtSignIcon, href: '#', label: 'Contact' },
];

const connectIcons = [
  { icon: CameraIcon, href: '#', label: 'Instagram' },
  { icon: VideoIcon, href: '#', label: 'Video' },
  { icon: MailIcon, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="bg-[#F4F3F5]">
      <div className="px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
            {/* Left Column — Brand */}
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold  text-text-primary tracking-tight mb-4">
                Redolapy
              </h2>
              <p className="text-text-disabled leading-relaxed max-w-sm mb-8  font-semibold">
                Elevating digital ateliers through artificial intelligence and
                human creativity.
              </p>
              <div className="flex items-center gap-4">
                {socialIcons.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="size-5  flex items-center justify-center hover:text-gray-500 text-[#006492] transition-all duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Center Column — Platform */}
            <div className="md:col-span-1">
              <h3 className=" font-semibold uppercase tracking-widest text-[#006492] mb-2">
                Platform
              </h3>
              <ul className="space-y-4">
                {platformLinks.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-disabled font-semibold hover:text-text-primary transition-colors "
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column — Connect */}
            <div className="md:col-span-1">
              <h3 className=" font-semibold uppercase tracking-widest text- text-[#006492] mb-2">
                Connect
              </h3>
              <div className="flex items-center  mb-10">
                {connectIcons.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 flex items-center  hover:text-[#006492] text-[#3E4850] transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                &copy; {new Date().getFullYear()} AELIA AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
