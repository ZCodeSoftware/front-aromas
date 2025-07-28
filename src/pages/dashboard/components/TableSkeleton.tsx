import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const TableSkeleton = () => {
	return (
		<div className='w-full p-4'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>
							<Skeleton className='h-5 w-24' />
						</TableHead>
						<TableHead>
							<Skeleton className='h-5 w-24' />
						</TableHead>
						<TableHead>
							<Skeleton className='h-5 w-20' />
						</TableHead>
						<TableHead className='text-right'>
							<Skeleton className='h-5 w-16' />
						</TableHead>
						<TableHead className='text-right'>
							<Skeleton className='h-5 w-12' />
						</TableHead>
						<TableHead className='text-center'>
							<Skeleton className='h-5 w-16' />
						</TableHead>
						<TableHead className='text-right'>
							<Skeleton className='h-5 w-20' />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, index) => (
						<TableRow key={index}>
							<TableCell>
								<Skeleton className='h-5 w-32' />
							</TableCell>
							<TableCell>
								<Skeleton className='h-5 w-24' />
							</TableCell>
							<TableCell>
								<Skeleton className='h-5 w-20' />
							</TableCell>
							<TableCell className='text-right'>
								<Skeleton className='h-5 w-16' />
							</TableCell>
							<TableCell className='text-right'>
								<Skeleton className='h-5 w-12' />
							</TableCell>
							<TableCell className='flex justify-center'>
								<Skeleton className='h-6 w-10 rounded-full' />
							</TableCell>
							<TableCell className='text-right'>
								<Skeleton className='h-8 w-8' />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TableSkeleton;
