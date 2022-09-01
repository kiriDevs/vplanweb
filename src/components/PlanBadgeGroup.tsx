import { Stack, Badge } from "react-bootstrap";

type Props = {
  partial?: number;
  full?: number;
  invalid?: number;
  className?: string;
};

const PlanBadgeGroup = ({ partial = 0, full = 0, invalid = 0, className = "" }: Props) => (
  <Stack direction="horizontal" gap={1} className={className}>
    {partial > 0 && (
      <Badge pill bg="secondary">
        {partial}
      </Badge>
    )}
    {full > 0 && (
      <Badge pill bg="primary">
        {full}
      </Badge>
    )}
    {invalid > 0 && (
      <Badge pill bg="danger">
        {invalid}
      </Badge>
    )}
  </Stack>
);

export default PlanBadgeGroup;
export type { Props };
