import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function WorkGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Worker Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="getting-started">
            <AccordionTrigger>Getting Started</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>Welcome to the Rail Madad worker interface! Here's how to get started:</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Check your assigned tasks in the "Active Tasks" tab</li>
                  <li>Review task details and priority</li>
                  <li>Click "Start Work" when beginning a task</li>
                  <li>Mark tasks as complete when finished</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="handling-tasks">
            <AccordionTrigger>Handling Tasks</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <h4 className="font-medium">Task Priority Levels:</h4>
                <ul className="list-disc pl-4 space-y-2">
                  <li>High Priority: Requires immediate attention</li>
                  <li>Medium Priority: Handle within 2-4 hours</li>
                  <li>Low Priority: Complete within the day</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reporting">
            <AccordionTrigger>Reporting Issues</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>If you encounter any issues:</p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Contact your supervisor immediately</li>
                  <li>Document the issue with photos if possible</li>
                  <li>Update the task status accordingly</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="best-practices">
            <AccordionTrigger>Best Practices</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <ul className="list-disc pl-4 space-y-2">
                  <li>Always verify the location before starting work</li>
                  <li>Follow safety protocols</li>
                  <li>Document your work with before/after photos</li>
                  <li>Update task status promptly</li>
                  <li>Report any additional issues discovered</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

