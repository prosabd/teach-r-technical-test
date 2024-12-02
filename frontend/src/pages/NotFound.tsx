import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-center">404 - Not Found</CardTitle>
          <CardDescription className="text-center text-lg">
            The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {/* <img src="/404-error.png" alt="404 Not Found" className="h-64 w-auto"/> */}
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
