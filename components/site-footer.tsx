import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 h-1 w-24 rounded bg-primary" aria-hidden />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Expert Connect</h3>
            <p className="mt-2 text-sm/6 opacity-80">
              Real-time consultation for love, business, career, marriage, legal and more.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm/6">
              <li>
                <Link href="/categories/love" className="hover:text-primary">
                  Love
                </Link>
              </li>
              <li>
                <Link href="/categories/marriage" className="hover:text-primary">
                  Marriage
                </Link>
              </li>
              <li>
                <Link href="/categories/career" className="hover:text-primary">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/categories/business" className="hover:text-primary">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/categories/legal" className="hover:text-primary">
                  Legal
                </Link>
              </li>
              <li>
                <Link href="/categories/health" className="hover:text-primary">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/categories/finance" className="hover:text-primary">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/categories/family" className="hover:text-primary">
                  Family
                </Link>
              </li>
              <li>
                <Link href="/categories/mental-wellness" className="hover:text-primary">
                  Mental Wellness
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm/6">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <p className="mt-3 text-sm/6 opacity-80">Have questions? We’re here to help.</p>
            <Link
              href="/support"
              className="mt-3 inline-block rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:brightness-110"
            >
              Support
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-xs opacity-80 md:flex-row">
          <p>© {new Date().getFullYear()} Expert Connect. All rights reserved.</p>
          <p>
            KSBM INFOTECH PVT LTD • <span className="text-accent">Made with care</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
