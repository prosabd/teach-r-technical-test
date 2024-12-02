import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router';

const Navbar: React.FC = () => {
    return (
        <div className="flex flex-col min-h-10">
            <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border">
                <div className="container mx-auto h-full">
                    <div className="flex justify-between items-center h-full px-4">
                        <div className="flex items-center gap-4">
                        <Link to="/"><h1 className="text-xl font-bold">Teach'R Test</h1></Link>
                        </div>

                        <div className="flex-1 flex items-center space-x-4">
                            <Button variant="ghost" className="ml-10" asChild>
                                <Link to="/">Home</Link>
                            </Button>
                        </div>

                        <div className="flex items-center">
                            <Link to="/login">
                                <Button variant="outline" size="default">
                                    Connect (Crud actions)
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;