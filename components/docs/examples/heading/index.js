// Import Statements
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
// Examples
export const examples = [
  {
    name: "Heading Sizes",
    Code: (
      function App() { const sizes = [ 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', ]; return (<Center>{sizes.map((size, index) =>(<Heading size={size} key={index}>{size}</Heading>))}</Center>); }
    )
  },
]