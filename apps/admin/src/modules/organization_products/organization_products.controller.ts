import { Controller } from '@nestjs/common';
import { OrganizationProductsService } from './organization_products.service';

@Controller('organization-products')
export class OrganizationProductsController {
  constructor(private readonly organizationProductsService: OrganizationProductsService) {}
}
