import { getInvestmentAssets } from "@/actions/asset-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrendingUp, IconCirclePlusFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default async function InvestmentsPage() {
  const assets = await getInvestmentAssets();

  const totalValue = assets.reduce((sum, asset) => {
    const currentValue =
      asset.currentPrice && asset.quantity
        ? Number(asset.currentPrice) * Number(asset.quantity)
        : 0;
    return sum + currentValue;
  }, 0);

  const totalGainLoss = assets.reduce((sum, asset) => {
    if (!asset.purchasePrice || !asset.currentPrice || !asset.quantity) return sum;
    const purchaseValue = Number(asset.purchasePrice) * Number(asset.quantity);
    const currentValue = Number(asset.currentPrice) * Number(asset.quantity);
    return sum + (currentValue - purchaseValue);
  }, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            Track and manage your investment portfolio
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {assets.length} assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalGainLoss >= 0 ? "+" : ""}$
              {totalGainLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalValue > 0
                ? `${((totalGainLoss / totalValue) * 100).toFixed(2)}%`
                : "0%"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asset Types</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(assets.map((a) => a.assetType)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different asset types</p>
          </CardContent>
        </Card>
      </div>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Investment Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconTrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No investments yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your investment portfolio by adding your first asset
              </p>
              <Button className="gap-2">
                <IconCirclePlusFilled className="h-4 w-4" />
                Add Investment Asset
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((asset) => {
                const currentValue =
                  asset.currentPrice && asset.quantity
                    ? Number(asset.currentPrice) * Number(asset.quantity)
                    : 0;
                const purchaseValue =
                  asset.purchasePrice && asset.quantity
                    ? Number(asset.purchasePrice) * Number(asset.quantity)
                    : 0;
                const gainLoss = currentValue - purchaseValue;
                const gainLossPercent =
                  purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;

                return (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{asset.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {asset.assetType}
                        </span>
                      </div>
                      {asset.ticker && (
                        <p className="text-sm text-muted-foreground">
                          Ticker: {asset.ticker}
                        </p>
                      )}
                      {asset.quantity && (
                        <p className="text-sm text-muted-foreground">
                          Quantity: {Number(asset.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${currentValue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      {purchaseValue > 0 && (
                        <div
                          className={`text-sm ${
                            gainLoss >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {gainLoss >= 0 ? "+" : ""}$
                          {gainLoss.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          ({gainLossPercent.toFixed(2)}%)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
