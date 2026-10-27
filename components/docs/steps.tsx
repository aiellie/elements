import { cn } from "@/lib/utils"

function Steps({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-not-typeset
      className={cn(
        "mt-(--typeset-flow) flex min-w-0 flex-col [counter-reset:step]",
        className
      )}
      {...props}
    />
  )
}

// The body opts back into `.typeset` so a step's heading, prose and code keep
// the page's rhythm while the rail beside it stays out of it.
function Step({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "group/step relative flex gap-4 [counter-increment:step]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-label text-muted-foreground after:content-[counter(step)]" />
        <div className="w-px flex-1 bg-border group-last/step:hidden" />
      </div>
      <div className="typeset min-w-0 flex-1 pt-0.5 pb-6 group-last/step:pb-0 [&>h3]:mt-0! [&>h3]:text-h4!">
        {children}
      </div>
    </li>
  )
}

export { Step, Steps }
