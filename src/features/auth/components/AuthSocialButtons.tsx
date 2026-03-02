import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function AuthSocialButtons() {
  const base =
    "relative w-full rounded-full bg-white/65 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-5 pr-12 py-3 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl";

  return (
    <div className="space-y-3">
      
      {/* Google */}
      <button type="button" className={base}>
        <span className="absolute right-5 top-1/2 -translate-y-1/2">
          <FcGoogle size={20} />
        </span>
        <span className="block text-center">
          Continue with Google
        </span>
      </button>

      {/* Facebook */}
      <button type="button" className={base}>
        <span className="absolute right-5 top-1/2 -translate-y-1/2">
          <FaFacebook size={18} className="text-[#1877F2]" />
        </span>
        <span className="block text-center">
          Continue with Facebook
        </span>
      </button>

    </div>
  );
}