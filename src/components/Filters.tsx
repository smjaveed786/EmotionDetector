import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filters as FiltersType } from '@/types/product';
import { Separator } from '@/components/ui/separator';

interface FiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) =>
                onFiltersChange({ inStockOnly: checked as boolean })
              }
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              In stock only
            </Label>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="font-semibold">Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  onFiltersChange({
                    minPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={0}
                className="rounded-xl"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFiltersChange({
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={0}
                className="rounded-xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">About ShopX</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Experience modern e-commerce with a beautiful, intuitive interface. Built with React,
            TypeScript, and Tailwind CSS.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
