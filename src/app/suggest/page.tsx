"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, ChefHat, Utensils, Info } from "lucide-react";

interface RecipeSuggestion {
    name: string;
    description: string;
    ingredientsUsed: string[];
    pantryStaples: string[];
}

export default function SuggestPage() {
    const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSuggestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/suggest", { method: "POST" });
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setSuggestions(data.suggestions || []);
                if (data.suggestions?.length === 0) {
                    setError("No suggestions found. Make sure your inventory is not empty!");
                }
            }
        } catch (e) {
            setError("Something went wrong while generating suggestions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    AI Kitchen Assistant
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Not sure what to cook? Let our AI analyze your inventory and suggest some delicious ideas.
                </p>
                <Button
                    size="lg"
                    onClick={generateSuggestions}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 h-12 rounded-full shadow-lg hover:shadow-orange-200 transition-all"
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Analyzing Ingredients..." : "Find What to Cook"}
                </Button>
            </div>

            {error && (
                <Card className="bg-red-50 border-red-100 max-w-md mx-auto">
                    <CardHeader className="flex flex-row items-center space-x-2">
                        <Info className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-red-800 text-lg">Suggestion Note</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">{error}</p>
                    </CardContent>
                </Card>
            )}

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-slate-100 rounded-xl" />
                    ))}
                </div>
            )}

            {!loading && suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestions.map((recipe, index) => (
                        <Card key={index} className="flex flex-col shadow-lg border-orange-50 hover:border-orange-200 transition-all hover:-translate-y-1">
                            <CardHeader className="pb-2">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                    <ChefHat className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl text-slate-900 group-hover:text-orange-600">
                                    {recipe.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <p className="text-slate-600 text-sm italic">
                                    &quot;{recipe.description}&quot;
                                </p>

                                <div className="space-y-2">
                                    <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <Utensils className="h-3 w-3 mr-1" /> From your kitchen
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {recipe.ingredientsUsed.map((ing, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded text-xs font-medium">
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {recipe.pantryStaples.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Pantry Staples Needed
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {recipe.pantryStaples.join(", ")}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                                    View Full Recipe
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && suggestions.length === 0 && !error && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <ChefHat className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-900">No suggestions yet</h3>
                    <p className="text-slate-500">Add some ingredients to your inventory and click the button above!</p>
                </div>
            )}
        </div>
    );
}
