import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#f5f6f8] text-[#111318] transition-colors duration-200">
      <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 bg-white border-b border-[#f0f1f5]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-3">
            <div className="flex items-center justify-between whitespace-nowrap">
              <div className="flex items-center gap-3 text-[#111318]">
                <div className="size-8 text-[#0d59f2] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]!">
                    dataset
                  </span>
                </div>
                <h2 className="text-[#111318] text-xl font-bold leading-tight tracking-[-0.015em]">
                  HRM System
                </h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                <nav className="flex items-center gap-6 lg:gap-9">
                  <a
                    className="text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors"
                    href="#"
                  >
                    Features
                  </a>
                  <a
                    className="text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors"
                    href="#"
                  >
                    Pricing
                  </a>
                  <a
                    className="text-[#111318] text-sm font-medium hover:text-[#0d59f2] transition-colors"
                    href="#"
                  >
                    Resources
                  </a>
                </nav>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-200 text-[#111318] text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate">Login</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#0d59f2] text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors"
                  >
                    <span className="truncate">Get Started</span>
                  </Link>
                </div>
              </div>
              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-gray-600">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative bg-white pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col gap-6 lg:w-1/2 text-left">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0d59f2]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  v2.0 is now live
                </div>
                <h1 className="text-[#111318] text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.02em]">
                  All-in-One Human Resource{" "}
                  <span className="text-[#0d59f2]">Management System</span>
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-[540px]">
                  Streamline your employee data, payroll, and attendance in one
                  secure platform. Designed for modern teams to work smarter.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#0d59f2] text-white text-base font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                    Start Free Trial
                  </button>
                  <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-white border border-gray-200 text-[#111318] text-base font-bold hover:bg-gray-50 transition-all">
                    Contact Sales
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {/* Placeholder Avatars */}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-500">
                      B
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-bold text-gray-500">
                      C
                    </div>
                  </div>
                  <p>Trusted by 10,000+ HR professionals</p>
                </div>
              </div>

              {/* Right Visual */}
              <div className="lg:w-1/2 w-full relative">
                {/* Decorative blur */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px]"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-green-400/20 rounded-full blur-[80px]"></div>

                <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden aspect-4/3 group perspective-1000 transform transition-transform hover:scale-[1.01]">
                  {/* Mockup Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white rounded text-[10px] px-2 py-1 text-gray-400 flex-1 mx-4 text-center">
                      hrm.dashboard.com
                    </div>
                  </div>

                  {/* Mockup Body */}
                  <div className="p-6 bg-white h-full">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-bold text-lg">
                          Dashboard Overview
                        </h3>
                        <p className="text-xs text-gray-400">
                          Welcome back, HR Manager
                        </p>
                      </div>
                      <button className="bg-[#0d59f2] text-white text-xs px-3 py-1.5 rounded">
                        Generate Report
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Total Employees
                        </div>
                        <div className="text-2xl font-bold text-[#0d59f2]">
                          1,248
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          On Time
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          96%
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          New Hires
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          24
                        </div>
                      </div>
                    </div>
                    {/* Pseudo Chart */}
                    <div className="h-32 w-full bg-linear-to-r from-blue-50 to-white rounded-lg border border-dashed border-gray-200 flex items-end justify-between px-4 pb-2 gap-2">
                      <div className="w-full bg-blue-200 h-[40%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-300 h-[60%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-400 h-[30%] rounded-t-sm"></div>
                      <div className="w-full bg-blue-500 h-[80%] rounded-t-sm"></div>
                      <div className="w-full bg-[#0d59f2] h-[65%] rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-[#111318] text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em] mb-4">
                Everything you need to manage your workforce
              </h2>
              <p className="text-slate-600 text-lg">
                Our comprehensive suite of tools helps you stay organized,
                compliant, and focused on your people.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Feature 1 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Employee Mgmt
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Centralize profiles, documents, and history in one secure
                    place.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Attendance
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Track time, manage shifts, and handle leave requests easily.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">Payroll</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Automate calculations and tax deductions instantly.
                  </p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    shield_person
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">
                    Roles & Access
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Define custom permissions to keep sensitive data secure.
                  </p>
                </div>
              </div>
              {/* Feature 5 */}
              <div className="group flex flex-col gap-4 rounded-xl border border-[#dbdfe6] bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#111318] text-lg font-bold">Reports</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Gain actionable insights with real-time data visualization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#f5f6f8]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 flex flex-col gap-8">
                <div>
                  <h2 className="text-[#111318] text-3xl font-bold leading-tight mb-4">
                    Focus on people, not paperwork.
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Stop drowning in spreadsheets. Our automated tools handle
                    the tedious tasks so you can build a better company culture.
                  </p>
                </div>
                <ul className="flex flex-col gap-5">
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Reduce manual work by 80%
                      </h4>
                      <p className="text-sm text-slate-500">
                        Automate onboarding, leave requests, and payroll
                        processing.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Increase team productivity
                      </h4>
                      <p className="text-sm text-slate-500">
                        Self-service portals empower employees to manage their
                        own info.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111318]">
                        Stay Compliant
                      </h4>
                      <p className="text-sm text-slate-500">
                        Automatically updated with the latest labor laws and tax
                        regulations.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full bg-white h-64 rounded-xl shadow-lg flex items-center justify-center text-gray-300 font-bold text-2xl">
                Image Placeholder
              </div>
            </div>
          </div>
        </section>

        {/* Target Users Section */}
        <section className="py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="text-center mb-16">
              <h2 className="text-[#111318] text-3xl font-bold mb-4">
                Built for every role
              </h2>
              <p className="text-slate-600">
                Whether you run the company or manage a team, we&apos;ve got you
                covered.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* HR Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0d59f2] shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    badge
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  For HR Professionals
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Automate routine tasks, manage benefits, and keep employee
                  records audit-ready without the headache.
                </p>
                <a
                  className="text-[#0d59f2] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              {/* Manager Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    supervisor_account
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  For Managers
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Track team performance, approve leave requests instantly, and
                  streamline shift planning.
                </p>
                <a
                  className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              {/* SME Card */}
              <div className="bg-slate-50 p-8 rounded-2xl border border-transparent hover:border-[#0d59f2]/20 transition-all">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm mb-6">
                  <span className="material-symbols-outlined text-3xl">
                    store
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111318] mb-3">
                  For Small Business
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Scale your team without the administrative overhead.
                  Affordable, easy to setup, and compliant.
                </p>
                <a
                  className="text-green-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  href="#"
                >
                  Learn more{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-10 px-4 sm:px-10">
          <div className="max-w-[1280px] mx-auto bg-[#0d59f2] rounded-3xl overflow-hidden relative">
            {/* Abstract pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 opacity-20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-8 text-center md:text-left">
              <div>
                <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Start managing your workforce{" "}
                  <br className="hidden md:block" /> smarter today.
                </h2>
                <p className="text-blue-100 text-lg max-w-lg">
                  Join thousands of companies growing with our HRM platform.
                  14-day free trial, no credit card required.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button className="bg-white text-[#0d59f2] font-bold py-3.5 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors w-full sm:w-auto">
                  Get Started Now
                </button>
                <button className="bg-transparent border border-white/30 text-white font-bold py-3.5 px-8 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#111318]">
                  <div className="size-6 text-[#0d59f2] flex items-center justify-center">
                    <span className="material-symbols-outlined"></span>
                  </div>
                  <span className="text-lg font-bold">HRM System</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Making work life better for everyone. The complete HR platform
                  for modern business.
                </p>
              </div>
              {/* Links 1 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Product</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Updates
                    </a>
                  </li>
                </ul>
              </div>
              {/* Links 2 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Company</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              {/* Links 3 */}
              <div>
                <h4 className="font-bold text-[#111318] mb-4">Resources</h4>
                <ul className="flex flex-col gap-3 text-sm text-slate-500">
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Webinars
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-[#0d59f2] transition-colors"
                      href="#"
                    >
                      Community
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4">
              <p className="text-xs text-slate-400">
                © 2026 HRM System Inc. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  className="text-slate-400 hover:text-[#0d59f2] transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-lg">
                    public
                  </span>
                </a>
                <a
                  className="text-slate-400 hover:text-[#0d59f2] transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-lg">
                    mail
                  </span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
