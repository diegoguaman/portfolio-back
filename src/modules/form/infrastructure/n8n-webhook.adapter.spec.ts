import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { N8nWebhookAdapter } from './n8n-webhook.adapter';
import { FormSubmissionEntity } from '../domain/form.entity';

// Mock global fetch
global.fetch = jest.fn();

describe('N8nWebhookAdapter', () => {
  let adapter: N8nWebhookAdapter;
  let configService: ConfigService;

  const mockFormData: FormSubmissionEntity = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Test message',
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        N8nWebhookAdapter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://n8n.example.com/webhook'),
          },
        },
      ],
    }).compile();

    adapter = module.get<N8nWebhookAdapter>(N8nWebhookAdapter);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('notifyFormSubmission', () => {
    it('should send form data to n8n webhook successfully', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await adapter.notifyFormSubmission(mockFormData);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://n8n.example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('"email":"john@example.com"'),
        }),
      );
    });

    it('should not throw error if webhook fails', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        adapter.notifyFormSubmission(mockFormData),
      ).resolves.not.toThrow();
    });

    it('should not throw error if webhook returns non-ok status', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        adapter.notifyFormSubmission(mockFormData),
      ).resolves.not.toThrow();
    });

    it('should skip notification if webhook URL is not configured', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          N8nWebhookAdapter,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(undefined),
            },
          },
        ],
      }).compile();

      const adapterDisabled = module.get<N8nWebhookAdapter>(N8nWebhookAdapter);
      const mockFetch = global.fetch as jest.Mock;

      await adapterDisabled.notifyFormSubmission(mockFormData);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should include all form fields in the payload', async () => {
      const mockFetch = global.fetch as jest.Mock;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      await adapter.notifyFormSubmission(mockFormData);

      const callArgs = mockFetch.mock.calls[0];
      const payload = JSON.parse(callArgs[1].body);

      expect(payload).toMatchObject({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      });
      expect(payload.createdAt).toBeDefined();
      expect(payload.timestamp).toBeDefined();
    });
  });
});

