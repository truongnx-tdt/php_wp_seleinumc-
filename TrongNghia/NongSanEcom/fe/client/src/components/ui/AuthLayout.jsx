const AuthLayout = ({ title, children, footerText, footerLink, footerLinkText }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4">
    <div className="bg-white rounded shadow p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">{title}</h2>
      {children}
      {footerText && (
        <div className="text-center mt-4 text-sm">
          {footerText} {footerLink && <a href={footerLink} className="text-green-700 hover:underline">{footerLinkText}</a>}
        </div>
      )}
    </div>
  </div>
)

export default AuthLayout 