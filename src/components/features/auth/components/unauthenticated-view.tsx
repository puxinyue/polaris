import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { SignInButton } from "@clerk/nextjs"
import { ShieldAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"



export const UnauthenticatedView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="w-full max-w-lg bg-muted">
         <Item variant="outline">
            <ItemMedia>
                <ShieldAlertIcon/>
            </ItemMedia>
            <ItemContent>
            <ItemTitle>Unauthenticated Access</ItemTitle>
            <ItemDescription>
                You need to be authenticated to access this page.
            </ItemDescription>
            </ItemContent>
            <ItemActions>
            <SignInButton>
                <Button variant="outline" size="sm">
                    Sign In
                </Button>
            </SignInButton>
            </ItemActions>
         </Item>
         
      </div>
    </div>
  )
}