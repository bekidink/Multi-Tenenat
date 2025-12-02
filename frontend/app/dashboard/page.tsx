
"use client";

import { useState } from "react";

import OutlineTable from "@/components/shared/outline/outline-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
 
 const [activeTab,setActiveTab]=useState("outline")
 const tabBadgeCounts = {
   "past-performance": 3,
   "key-personnel": 2,
   
 };
 
  return (
    <div className="min-h-screen  pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 min-w-md h-auto rounded-xl bg-custom p-1 mb-6 overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="outline"
              className="text-xs sm:text-sm whitespace-nowrap px-3 py-2"
            >
              Outline
            </TabsTrigger>
            <TabsTrigger
              value="past-performance"
              className="text-xs sm:text-sm whitespace-nowrap px-3 py-2"
            >
              Past Performance
              <Badge
                className=" h-5 min-w-5 px-1 text-xs bg-custom-secondary text-white border-none"
                variant="default"
              >
                {tabBadgeCounts["past-performance"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="key-personnel"
              className="text-xs sm:text-sm whitespace-nowrap px-3 py-2"
            >
              Key Personnel
              <Badge
                className=" h-5 min-w-5 px-1 text-xs bg-custom-secondary text-white border-none"
                variant="default"
              >
                {tabBadgeCounts["key-personnel"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="focus-documents"
              className="text-xs sm:text-sm whitespace-nowrap px-3 py-2"
            >
              Focus Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outline" className="mt-0">
            <OutlineTable />
          </TabsContent>

          <TabsContent value="past-performance">
            <div className="text-center py-12 text-muted-foreground">
              Past Performance content coming soon...
            </div>
          </TabsContent>

          <TabsContent value="key-personnel">
            <div className="text-center py-12 text-muted-foreground">
              Key Personnel section coming soon...
            </div>
          </TabsContent>

          <TabsContent value="focus-documents">
            <div className="text-center py-12 text-muted-foreground">
              Focus Documents section coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
