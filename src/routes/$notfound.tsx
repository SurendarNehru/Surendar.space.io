import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/$notfound')({
  component: NotFoundComponent,
  params: {
    parse: (params) => ({ notfound: params.notfound || '' }),
    stringify: (params) => ({ notfound: params.notfound || '' }),
  },
})

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white/90">Lost in space</h2>
        <p className="mt-2 text-sm text-white/60">
          This coordinate doesn't exist in the known universe.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
